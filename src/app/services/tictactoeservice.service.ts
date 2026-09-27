import { Injectable } from '@angular/core';

export class Block {
  free: boolean = true;
  value: string = ""; // "tick" (Joueur) ou "cross" (Lyko)
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
    return this.symbol === 'done' ? 'assets/bleu.jpg' : 'assets/gblanc.jpg';
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
  bot: boolean = true;
  score: number = 0;
  name: string = "";
  avatar: string = "";

  updateScore(total: number): number {
    this.score += total;
    return this.score;
  }

  resetScore(): void {
    this.score = 0;
  }
}

@Injectable({
  providedIn: 'root'
})
export class TictactoeserviceService {

  players: Player[] = [];
  turn: number = 0; // 0 = Joueur, 1 = Lykö le Sage
  draw: number = 0;
  blocks: Block[] = [];
  freeBlocksRemaining: number = 9;

  gridSize: number = 3;
  readonly winningStreak: number = 3;
  readonly GRID_MIN_SIZE: number = 3;

  /** Empêche de recompter les alignements déjà validés dans la manche (ex: "h-0-1-2") */
  private scoredAlignments: Set<string> = new Set<string>();

  isBotThinking: boolean = false;

  constructor() {
    this.initPlayers();
    this.initBlocks();
  }

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
    const player1 = new Player();
    player1.bot = false;
    player1.name = "VOUS";
    player1.avatar = "🎸";

    const player2 = new Player();
    player2.bot = true;
    player2.name = "LYKÖ LE SAGE";
    player2.avatar = "🐵";

    this.players = [player1, player2];
  }

  changeTurn(): number {
    this.turn = this.turn === 0 ? 1 : 0;
    return this.turn;
  }

  /**
   * RÈGLE ABSOLUE : Le jeu ne s'arrête QUE lorsque 100% des cases sont occupées.
   */
  get isGameOver(): boolean {
    return this.freeBlocksRemaining <= 0;
  }

  /**
   * Joue un coup sur la case d'index donné, met à jour la grille et comptabilise le score.
   */
  playMove(index: number): boolean {
    if (index < 0 || index >= this.blocks.length || !this.blocks[index].free) {
      return false;
    }

    const currentBlock = this.blocks[index];
    currentBlock.free = false;
    currentBlock.setValue(this.turn === 0 ? "tick" : "cross");
    this.freeBlocksRemaining--;

    // Recherche optimisée ciblée sur l'index joué
    const newAlignments = this.checkNewAlignments(index);
    if (newAlignments > 0) {
      this.players[this.turn].updateScore(newAlignments);
    }

    return true;
  }

  /**
   * Scanne la grille pour détecter de NOUVEAUX alignements.
   * Si `lastIndex` est renseigné, réalise un scan ciblé O(1). Sinon, fait un scan global.
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

    if (lastIndex === undefined) {
      return this.globalScanAlignments();
    }

    const row = Math.floor(lastIndex / N);
    const col = lastIndex % N;

    // 1. Horizontales
    for (let c = Math.max(0, col - K + 1); c <= Math.min(N - K, col); c++) {
      checkAndScoreLine([row * N + c, row * N + c + 1, row * N + c + 2], `h-${row}-${c}`);
    }

    // 2. Verticales
    for (let r = Math.max(0, row - K + 1); r <= Math.min(N - K, row); r++) {
      checkAndScoreLine([r * N + col, (r + 1) * N + col, (r + 2) * N + col], `v-${r}-${col}`);
    }

    // 3. Diagonale ↘
    for (let offset = -(K - 1); offset <= 0; offset++) {
      const r = row + offset;
      const c = col + offset;
      if (r >= 0 && r <= N - K && c >= 0 && c <= N - K) {
        checkAndScoreLine([r * N + c, (r + 1) * N + c + 1, (r + 2) * N + c + 2], `d1-${r}-${c}`);
      }
    }

    // 4. Diagonale ↙
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
   * Scan global complet de la grille (fallback).
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
      if (this.blocks[idx]) this.blocks[idx].isWinningCell = true;
    });
  }

  clearWinningHighlight(): void {
    this.blocks.forEach(b => (b.isWinningCell = false));
  }

  /**
   * IA : Calcul du coup de Lykö le Sage
   */
  figureBotMove(): number {
    // 1. Chercher un coup gagnant
    const winMove = this.findSmartMove('cross');
    if (winMove !== -1 && this.blocks[winMove].free) return winMove;

    // 2. Bloquer l'adversaire
    const blockMove = this.findSmartMove('tick');
    if (blockMove !== -1 && this.blocks[blockMove].free) return blockMove;

    // 3. Prendre le centre si libre
    const centerIdx = Math.floor((this.gridSize * this.gridSize) / 2);
    if (this.blocks[centerIdx] && this.blocks[centerIdx].free) return centerIdx;

    // 4. Prendre une case libre aléatoire
    const freeIndices = this.blocks
      .map((block, idx) => (block.free ? idx : -1))
      .filter(idx => idx !== -1);

    if (freeIndices.length > 0) {
      return freeIndices[Math.floor(Math.random() * freeIndices.length)];
    }

    return -1;
  }

  private findSmartMove(targetValue: string): number {
    const N = this.gridSize;
    const K = 3;
    const checkLine = (lineIndices: number[]) => {
      const filled = lineIndices.filter(i => !this.blocks[i].free && this.blocks[i].value === targetValue);
      const empty = lineIndices.filter(i => this.blocks[i].free);
      if (filled.length === K - 1 && empty.length === 1) return empty[0];
      return -1;
    };

    for (let r = 0; r < N; r++) {
      for (let c = 0; c <= N - K; c++) {
        const res = checkLine([r * N + c, r * N + (c + 1), r * N + (c + 2)]);
        if (res !== -1) return res;
      }
    }
    for (let c = 0; c < N; c++) {
      for (let r = 0; r <= N - K; r++) {
        const res = checkLine([r * N + c, (r + 1) * N + c, (r + 2) * N + c]);
        if (res !== -1) return res;
      }
    }
    for (let r = 0; r <= N - K; r++) {
      for (let c = 0; c <= N - K; c++) {
        const res = checkLine([r * N + c, (r + 1) * N + (c + 1), (r + 2) * N + (c + 2)]);
        if (res !== -1) return res;
      }
    }
    for (let r = 0; r <= N - K; r++) {
      for (let c = K - 1; c < N; c++) {
        const res = checkLine([r * N + c, (r + 1) * N + (c - 1), (r + 2) * N + (c - 2)]);
        if (res !== -1) return res;
      }
    }
    return -1;
  }

  resetAll(): void {
    this.blocks.forEach(b => b.reset());
    this.freeBlocksRemaining = this.gridSize * this.gridSize;
    this.scoredAlignments.clear();
    this.players.forEach(p => p.resetScore());
  }
}