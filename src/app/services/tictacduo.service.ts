import { Injectable } from '@angular/core';

export class Block {
  free: boolean = true;
  value: string = ""; // "tick" (Joueur 1) ou "cross" (Joueur 2)
  symbol: string = "";
  isWinningCell: boolean = false;
  isNew: boolean = false;
  isHovered: boolean = false;

  private timerId: number | null = null;

  setValue(value: string): void {
    this.value = value;
    this.symbol = value === "tick" ? "done" : "close";
    this.isNew = true;

    if (this.timerId !== null) {
      clearTimeout(this.timerId);
    }

    this.timerId = window.setTimeout(() => {
      this.isNew = false;
      this.timerId = null;
    }, 500);
  }

  urlimg(): string {
    return this.symbol === 'done' ? 'assets/rouge.jpg' : 'assets/gblanc.jpg';
  }

  reset(): void {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.free = true;
    this.value = "";
    this.symbol = "";
    this.isWinningCell = false;
    this.isNew = false;
    this.isHovered = false;
  }
}

export class Player {
  bot: boolean = false;
  score: number = 0;
  name: string = "";
  avatar: string = "";

  updateScore(points: number): number {
    this.score += points;
    return this.score;
  }

  resetScore(): void {
    this.score = 0;
  }
}

@Injectable({
  providedIn: 'root'
})
export class TictacduoService {
  players: Player[] = [];
  turn: number = 0; // 0 = Joueur 1, 1 = Joueur 2
  draw: number = 0;
  blocks: Block[] = [];
  freeBlocksRemaining: number = 9;

  gridSize: number = 3;
  readonly winningStreak: number = 3;
  readonly GRID_MIN_SIZE: number = 3;

  /** Empêche de recompter les alignements déjà validés (ex: "h-0-1-2") */
  private scoredAlignments: Set<string> = new Set<string>();

  constructor() {
    this.initPlayers();
    this.initBlocks();
  }

  /**
   * Initialise la grille de jeu avec validation de taille minimale
   */
  initBlocks(size: number = this.gridSize): void {
    this.gridSize = Math.max(this.GRID_MIN_SIZE, size);
    const totalCells = this.gridSize * this.gridSize;

    this.blocks = Array.from({ length: totalCells }, () => new Block());
    this.freeBlocksRemaining = totalCells;
    this.scoredAlignments.clear();
  }

  nextLevel(): void {
    this.gridSize += 1;
    this.initBlocks(this.gridSize);
  }

  previousLevel(): void {
    if (this.gridSize > this.GRID_MIN_SIZE) {
      this.gridSize -= 1;
      this.initBlocks(this.gridSize);
    }
  }

  initPlayers(): void {
    const p1 = new Player();
    p1.name = "JOUEUR 1";
    p1.avatar = "🎸";

    const p2 = new Player();
    p2.name = "JOUEUR 2";
    p2.avatar = "🎸";

    this.players = [p1, p2];
  }

  changeTurn(): number {
    this.turn = this.turn === 0 ? 1 : 0;
    return this.turn;
  }

  /**
   * Condition d'arrêt : Le jeu s'arrête UNIQUEMENT quand toutes les cases sont remplies.
   */
  get isGameOver(): boolean {
    return this.freeBlocksRemaining <= 0;
  }

  /**
   * Exécute un coup et gère l'attribution directe des scores.
   */
  playMove(index: number): boolean {
    if (index < 0 || index >= this.blocks.length || !this.blocks[index].free) {
      return false;
    }

    const currentBlock = this.blocks[index];
    currentBlock.free = false;
    currentBlock.setValue(this.turn === 0 ? "tick" : "cross");
    this.freeBlocksRemaining--;

    // Évaluation ciblée du coup joué
    const newAlignments = this.checkNewAlignments(index);
    if (newAlignments > 0) {
      this.players[this.turn].updateScore(newAlignments);
    }

    return true;
  }

  /**
   * Algorithme ciblé : Scanne uniquement les axes traversant la case jouée (`lastIndex`)
   * Complexité O(1) par rapport à la taille de la grille.
   */
  checkNewAlignments(lastIndex?: number): number {
    const N = this.gridSize;
    const K = this.winningStreak; // 3
    let newAlignmentsCount = 0;
    const newlyWinningIndices = new Set<number>();

    const checkAndScoreLine = (indices: number[], lineKey: string) => {
      const firstBlock = this.blocks[indices[0]];
      if (firstBlock.free || !firstBlock.value) return;

      const isMatch = indices.every(
        idx => !this.blocks[idx].free && this.blocks[idx].value === firstBlock.value
      );

      if (isMatch && !this.scoredAlignments.has(lineKey)) {
        this.scoredAlignments.add(lineKey);
        newAlignmentsCount++;
        indices.forEach(idx => newlyWinningIndices.add(idx));
      }
    };

    // Si aucun index spécifique n'est fourni, on bascule sur un scan global (sécurité)
    if (lastIndex === undefined) {
      return this.globalScanAlignments();
    }

    const row = Math.floor(lastIndex / N);
    const col = lastIndex % N;

    // 1. Axe Horizontal
    for (let c = Math.max(0, col - K + 1); c <= Math.min(N - K, col); c++) {
      checkAndScoreLine([row * N + c, row * N + c + 1, row * N + c + 2], `h-${row}-${c}`);
    }

    // 2. Axe Vertical
    for (let r = Math.max(0, row - K + 1); r <= Math.min(N - K, row); r++) {
      checkAndScoreLine([r * N + col, (r + 1) * N + col, (r + 2) * N + col], `v-${r}-${col}`);
    }

    // 3. Axe Diagonale ↘
    for (let offset = -(K - 1); offset <= 0; offset++) {
      const r = row + offset;
      const c = col + offset;
      if (r >= 0 && r <= N - K && c >= 0 && c <= N - K) {
        checkAndScoreLine([r * N + c, (r + 1) * N + c + 1, (r + 2) * N + c + 2], `d1-${r}-${c}`);
      }
    }

    // 4. Axe Diagonale ↙
    for (let offset = -(K - 1); offset <= 0; offset++) {
      const r = row + offset;
      const c = col - offset;
      if (r >= 0 && r <= N - K && c >= K - 1 && c < N) {
        checkAndScoreLine([r * N + c, (r + 1) * N + c - 1, (r + 2) * N + c - 2], `d2-${r}-${c}`);
      }
    }

    if (newlyWinningIndices.size > 0) {
      this.highlightWinningCells(Array.from(newlyWinningIndices));
    }

    return newAlignmentsCount;
  }

  /**
   * Scan de secours complet de toute la grille.
   */
  private globalScanAlignments(): number {
    const N = this.gridSize;
    const K = this.winningStreak;
    let count = 0;
    const newlyWinningIndices = new Set<number>();

    const checkLine = (indices: number[], lineKey: string) => {
      const first = this.blocks[indices[0]];
      if (first.free || !first.value) return;

      const isMatch = indices.every(
        idx => !this.blocks[idx].free && this.blocks[idx].value === first.value
      );

      if (isMatch && !this.scoredAlignments.has(lineKey)) {
        this.scoredAlignments.add(lineKey);
        count++;
        indices.forEach(idx => newlyWinningIndices.add(idx));
      }
    };

    for (let r = 0; r < N; r++) {
      for (let c = 0; c <= N - K; c++) {
        checkLine([r * N + c, r * N + c + 1, r * N + c + 2], `h-${r}-${c}`);
      }
    }

    for (let c = 0; c < N; c++) {
      for (let r = 0; r <= N - K; r++) {
        checkLine([r * N + c, (r + 1) * N + c, (r + 2) * N + c], `v-${r}-${c}`);
      }
    }

    for (let r = 0; r <= N - K; r++) {
      for (let c = 0; c <= N - K; c++) {
        checkLine([r * N + c, (r + 1) * N + c + 1, (r + 2) * N + c + 2], `d1-${r}-${c}`);
      }
    }

    for (let r = 0; r <= N - K; r++) {
      for (let c = K - 1; c < N; c++) {
        checkLine([r * N + c, (r + 1) * N + c - 1, (r + 2) * N + c - 2], `d2-${r}-${c}`);
      }
    }

    if (newlyWinningIndices.size > 0) {
      this.highlightWinningCells(Array.from(newlyWinningIndices));
    }

    return count;
  }

  private highlightWinningCells(indices: number[]): void {
    indices.forEach(idx => {
      if (this.blocks[idx]) {
        this.blocks[idx].isWinningCell = true;
      }
    });
  }

  clearWinningHighlight(): void {
    this.blocks.forEach(b => (b.isWinningCell = false));
  }

  resetAll(): void {
    this.blocks.forEach(b => b.reset());
    this.freeBlocksRemaining = this.gridSize * this.gridSize;
    this.scoredAlignments.clear();
    this.players.forEach(p => p.resetScore());
  }
}