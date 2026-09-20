import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../services/game.service';
import { TictactoeserviceService } from '../services/tictactoeservice.service';
import { CardData } from './CardData';
import { RdialogComponent } from './rdialog/rdialog.component';

@Component({
  selector: 'app-cardgame',
  templateUrl: './cardgame.component.html',
  styleUrls: ['./cardgame.component.css']
})
export class CardgameComponent implements OnInit {

  etapedujeu: string = "0";
  lavie: number | string | undefined;
  lebonus: number | string | undefined;
  pointdevies: number = 0;
  pointdebonus: number = 0;
  cardImages = [
    'assets/bleu.jpg',
      'assets/vert.jpg',
    'assets/rouge.jpg',
    'assets/vert.jpg',
    'assets/noir.jpg',
    'assets/blanc.jpg'
  ];
  cards: CardData[] = [];
  flippedCards: CardData[] = [];
  matchedCount = 0;

  constructor(private dialog: MatDialog, private Activatedroute: ActivatedRoute, private snackBar: MatSnackBar, public gs: TictactoeserviceService, private router: Router, private gameService: GameService) {

  }

  ngOnInit(): void {
    this.lavie = this.Activatedroute.snapshot.queryParamMap.get('vie') || 0;
		this.lebonus = this.Activatedroute.snapshot.queryParamMap.get('bonus') || 0;
		this.etapedujeu = this.Activatedroute.snapshot.queryParamMap.get('etape') || this.etapedujeu;
		this.pointdevies = parseInt(this.lavie.toString());
    this.setupCards();
  }

  shuffleArray(anArray: any[]): any[] {
    return anArray.map(a => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1]);
  }

  setupCards(): void {
    this.cards = [];
    this.cardImages.forEach((image) => {
      const cardData: CardData = {
        imageId: image,
        state: 'default'
      };
      this.cards.push({ ...cardData });
      this.cards.push({ ...cardData });
    });
    this.cards = this.shuffleArray(this.cards);
  }

  cardClicked(index: number): void {
    this.decrementervie();
    const cardInfo = this.cards[index];
    if (cardInfo.state === 'default' && this.flippedCards.length < 2) {
      cardInfo.state = 'flipped';
      this.flippedCards.push(cardInfo);
      if (this.flippedCards.length > 1) {
        this.checkForCardMatch();
      }
    } else if (cardInfo.state === 'flipped') {
      cardInfo.state = 'default';
      this.flippedCards.pop();
    }
  }

  checkForCardMatch(): void {
    setTimeout(() => {
      const cardOne = this.flippedCards[0];
      const cardTwo = this.flippedCards[1];
      const nextState = cardOne.imageId === cardTwo.imageId ? 'matched' : 'default';
      cardOne.state = cardTwo.state = nextState;
      this.flippedCards = [];
      if (nextState === 'matched') {
        this.matchedCount++;
        if (this.matchedCount === this.cardImages.length) {
          this.incrementervie()
          const dialogRef = this.dialog.open(RdialogComponent, {
            disableClose: true
          });

          dialogRef.afterClosed().subscribe(() => {
            this.restart();
          });
        }
      }
    }, 1000);
  }

  incrementervie() {
		this.pointdevies += 5000;
		this.lavie = this.pointdevies;
	}

  decrementervie() {
		this.pointdevies -= 100;
		this.lavie = this.pointdevies;
	}

  restart(): void {
    this.matchedCount = 0;
    this.setupCards();
  }

  onrecommencer() {
    if ((this.lavie) && (this.lebonus)) { this.goToPlay(this.lavie, this.lebonus,this.etapedujeu); }
  }

  goToPlay(lavie: string | number, lebonus: string | number, letape: string | number) {
		this.router.navigate(['/play'], { queryParams: { vie: lavie, bonus: lebonus, etape: letape } });
	}
  
  gagnant() {
    return this.pointdevies != 0;
  }

  casuffit() { return this.pointdevies >= 10000; }

  oncontinue() { return this.pointdevies < 10000; }

}
