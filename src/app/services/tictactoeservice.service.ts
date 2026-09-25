import { Injectable } from '@angular/core';

export class Block {
  free: boolean = true;
  value: string = ""; // "tick" (Joueur) ou "cross" (Lyko)
  symbol: string = "";
  isWinningCell: boolean = false;
  isNew: boolean = false;
  isHovered: boolean = false;

  setValue(value: string) {
    this.value = value;
    this.symbol = value === "tick" ? "done" : "close";
    this.isNew = true;
    setTimeout(() => this.isNew = false, 500);
  }

  urlimg(): string {
    return this.symbol === 'done' ? 'assets/bleu.jpg' : 'assets/gblanc.jpg';
  }

  reset() {
    this.free = true;
    this.value = "";
    this.symbol = "";
    this.isWinningCell = false;
    this.isNew = false;
  }
}

export class Player {
  bot: boolean = true;
  score: number = 0;
  name: string = "";
  avatar: string = "";

  updateScore(total: number) {
    this.score += total;
    return this.score;
  }
}

@Injectable({
  providedIn: 'root'
})
export class TictactoeserviceService {

  players: Player[] = [];
  turn: number = 0;
  draw: number = 0;
  blocks: Block[] = [];
  freeBlocksRemaining: number = 9;

  gridSize: number = 3;
  /** RÈGLE : La longueur d'alignement est TOUJOURS de 3 pions */
  readonly winningStreak: number = 3;
  
  /** Stocke les clés d'alignements déjà comptabilisés (ex: "h-0-1-2") */
  private scoredAlignments: Set<string> = new Set<string>();
  
  isBotThinking: boolean = false;

  constructor() {
    this.initPlayers();
    this.initBlocks();
  }

  initBlocks(size: number = this.gridSize): void {
    this.gridSize = size;
    const totalCells = this.gridSize * this.gridSize;

    this.blocks = Array.from({ length: totalCells }, () => new Block());
    this.freeBlocksRemaining = totalCells;
    this.scoredAlignments.clear();
  }

  nextLevel(): void {
    this.gridSize += 1;
    this.initBlocks(this.gridSize);
  }

  initPlayers(): void {
    this.players = [];
    const player1 = new Player();
    player1.bot = false;
    player1.name = "VOUS";
    player1.avatar = "🎸";

    const player2 = new Player();
    player2.bot = true;
    player2.name = "LYKÖ LE SAGE";
    player2.avatar = "🐵";

    this.players.push(player1, player2);
  }

  changeTurn(): number {
    this.turn = this.turn === 0 ? 1 : 0;
    return this.turn;
  }

  /**
   * Scanne toute la grille à la recherche de NOUVEAUX alignements de 3 pions.
   * Retourne le nombre de nouveaux alignements trouvés lors de ce tour.
   */
  checkNewAlignments(): number {
    const N = this.gridSize;
    const K = 3; // Alignement de 3 fixe
    let newAlignmentsCount = 0;
    const newlyWinningIndices = new Set<number>();

    const checkAndScoreLine = (indices: number[], lineKey: string) => {
      const firstVal = this.blocks[indices[0]].value;
      if (!firstVal || this.blocks[indices[0]].free) return;

      const isMatch = indices.every(idx => !this.blocks[idx].free && this.blocks[idx].value === firstVal);

      if (isMatch && !this.scoredAlignments.has(lineKey)) {
        this.scoredAlignments.add(lineKey);
        newAlignmentsCount++;
        indices.forEach(idx => newlyWinningIndices.add(idx));
      }
    };

    // 1. Horizontales
    for (let r = 0; r < N; r++) {
      for (let c = 0; c <= N - K; c++) {
        const indices = [r * N + c, r * N + (c + 1), r * N + (c + 2)];
        checkAndScoreLine(indices, `h-${r}-${c}`);
      }
    }

    // 2. Verticales
    for (let c = 0; c < N; c++) {
      for (let r = 0; r <= N - K; r++) {
        const indices = [r * N + c, (r + 1) * N + c, (r + 2) * N + c];
        checkAndScoreLine(indices, `v-${r}-${c}`);
      }
    }

    // 3. Diagonales ↘
    for (let r = 0; r <= N - K; r++) {
      for (let c = 0; c <= N - K; c++) {
        const indices = [r * N + c, (r + 1) * N + (c + 1), (r + 2) * N + (c + 2)];
        checkAndScoreLine(indices, `d1-${r}-${c}`);
      }
    }

    // 4. Diagonales ↙
    for (let r = 0; r <= N - K; r++) {
      for (let c = K - 1; c < N; c++) {
        const indices = [r * N + c, (r + 1) * N + (c - 1), (r + 2) * N + (c - 2)];
        checkAndScoreLine(indices, `d2-${r}-${c}`);
      }
    }

    if (newlyWinningIndices.size > 0) {
      this.highlightWinningCells(Array.from(newlyWinningIndices));
    }

    return newAlignmentsCount;
  }

  private highlightWinningCells(indices: number[]) {
    indices.forEach(idx => {
      if (this.blocks[idx]) this.blocks[idx].isWinningCell = true;
    });
  }

  clearWinningHighlight(): void {
    this.blocks.forEach(b => b.isWinningCell = false);
  }

  figureBotMove(): number {
    const winMove = this.findSmartMove('cross');
    if (winMove !== -1) return winMove;
    const blockMove = this.findSmartMove('tick');
    if (blockMove !== -1) return blockMove;

    const centerIdx = Math.floor((this.gridSize * this.gridSize) / 2);
    if (this.blocks[centerIdx] && this.blocks[centerIdx].free) return centerIdx;

    const freeIndices = this.blocks
      .map((block, idx) => block.free ? idx : -1)
      .filter(idx => idx !== -1);

    if (freeIndices.length > 0) {
      return freeIndices[Math.floor(Math.random() * freeIndices.length)];
    }
    return 0;
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

  resetAll() {
    this.blocks.forEach(b => b.reset());
    this.scoredAlignments.clear();
  }
}