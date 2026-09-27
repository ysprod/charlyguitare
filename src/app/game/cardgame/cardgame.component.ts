import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CardData } from './CardData';
import { RdialogComponent } from './rdialog/rdialog.component';

interface Particle {
  left: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
}

interface Coin {
  left: number;
  delay: number;
  duration: number;
  symbol: string;
}

@Component({
  selector: 'app-cardgame',
  templateUrl: './cardgame.component.html',
  styleUrls: ['./cardgame.component.css']
})
export class CardgameComponent implements OnInit, OnDestroy {

  etapedujeu: string = "0";
  lavie: number = 0;
  lebonus: number = 0;
  pointdevies: number = 0;

  cardImages = [
    'assets/rouge.jpg',
    'assets/bleu.jpg',
    'assets/vert.jpg',
    'assets/rouge.jpg',
    'assets/noir.jpg',
    'assets/blanc.jpg'
  ];

  cards: CardData[] = [];
  flippedCards: CardData[] = [];
  matchedCount = 0;
  moves = 0;
  isProcessing = false;

  /* Décor */
  particles: Particle[] = [];
  coins: Coin[] = [];

  private readonly PARTICLE_COLORS = ['#6366f1', '#10b981', '#facc15', '#f472b6', '#38bdf8'];
  private readonly COIN_SYMBOLS = ['🪙', '💰', '💎', '⭐', '🍌', '🏆'];

  constructor(
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const queryVie = this.activatedRoute.snapshot.queryParamMap.get('vie');
    const queryBonus = this.activatedRoute.snapshot.queryParamMap.get('bonus');
    const queryEtape = this.activatedRoute.snapshot.queryParamMap.get('etape');

    this.pointdevies = queryVie ? parseInt(queryVie, 10) : 1000;
    this.lavie = this.pointdevies;
    this.lebonus = queryBonus ? parseInt(queryBonus, 10) : 0;
    this.etapedujeu = queryEtape || "0";

    this.generateDecor();
    this.setupCards();
  }

  ngOnDestroy(): void {
    // Rien à nettoyer
  }

  /* ============================================================
     DÉCOR
     ============================================================ */
  private generateDecor(): void {
    this.particles = Array.from({ length: 30 }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 8,
      size: 2 + Math.random() * 4,
      color: this.PARTICLE_COLORS[
        Math.floor(Math.random() * this.PARTICLE_COLORS.length)
      ]
    }));

    this.coins = Array.from({ length: 10 }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 12 + Math.random() * 8,
      symbol: this.COIN_SYMBOLS[
        Math.floor(Math.random() * this.COIN_SYMBOLS.length)
      ]
    }));
  }

  /* ============================================================
     JEU
     ============================================================ */
  shuffleArray<T>(array: T[]): T[] {
    return array
      .map(item => ({ sort: Math.random(), value: item }))
      .sort((a, b) => a.sort - b.sort)
      .map(item => item.value);
  }

  setupCards(): void {
    const cardPairs: CardData[] = [];
    this.cardImages.forEach((image) => {
      cardPairs.push({ imageId: image, state: 'default' });
      cardPairs.push({ imageId: image, state: 'default' });
    });
    this.cards = this.shuffleArray(cardPairs);
    this.flippedCards = [];
    this.isProcessing = false;
  }

  cardClicked(index: number): void {
    const cardInfo = this.cards[index];

    if (this.isProcessing || cardInfo.state !== 'default') {
      return;
    }

    this.decrementervie();
    cardInfo.state = 'flipped';
    this.flippedCards.push(cardInfo);

    if (this.flippedCards.length === 2) {
      this.moves++;
      this.isProcessing = true;
      this.checkForCardMatch();
    }
  }

  checkForCardMatch(): void {
    setTimeout(() => {
      const [cardOne, cardTwo] = this.flippedCards;

      if (cardOne.imageId === cardTwo.imageId) {
        cardOne.state = 'matched';
        cardTwo.state = 'matched';
        this.matchedCount++;

        if (this.matchedCount === this.cardImages.length) {
          this.incrementervie();
          this.openVictoryDialog();
        }
      } else {
        cardOne.state = 'default';
        cardTwo.state = 'default';
      }

      this.flippedCards = [];
      this.isProcessing = false;
    }, 800);
  }

  openVictoryDialog(): void {
    const dialogRef = this.dialog.open(RdialogComponent, {
      disableClose: true,
      panelClass: 'victory-dialog-container'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.restart();
    });
  }

  incrementervie(): void {
    this.pointdevies += 5000;
    this.lavie = this.pointdevies;
  }

  decrementervie(): void {
    this.pointdevies = Math.max(0, this.pointdevies - 100);
    this.lavie = this.pointdevies;
  }

  restart(): void {
    this.matchedCount = 0;
    this.moves = 0;
    this.setupCards();
  }

  onrecommencer(): void {
    if (this.lavie !== undefined && this.lebonus !== undefined) {
      this.goToPlay(this.lavie, this.lebonus, this.etapedujeu);
    }
  }

  goToPlay(lavie: number, lebonus: number, letape: string): void {
    this.router.navigate(['/play'], {
      queryParams: { vie: lavie, bonus: lebonus, etape: letape }
    });
  }

  gagnant(): boolean {
    return this.pointdevies > 0;
  }

  casuffit(): boolean {
    return this.pointdevies >= 10000;
  }

  oncontinue(): boolean {
    return this.pointdevies < 10000;
  }
}