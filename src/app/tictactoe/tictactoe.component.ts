import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
 
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../services/game.service';
import { TictactoeserviceService } from '../services/tictactoeservice.service';
 

@Component({
	selector: 'app-tictactoe',
	templateUrl: './tictactoe.component.html',
	styleUrls: ['./tictactoe.component.css']
})
export class TictactoeComponent implements OnInit {

	lock = false;
	rejouer = false;
	etapedujeu: string = "0";
	lavie: number | string | undefined;
	lebonus: number | string | undefined;
	pointdevies: number = 0;
	pointdebonus: number = 0;

	constructor(private Activatedroute: ActivatedRoute, private snackBar: MatSnackBar, public gs: TictactoeserviceService, private router: Router, private gameService: GameService) { }

	ngOnInit(): void {
		this.lavie = this.Activatedroute.snapshot.queryParamMap.get('vie') || 0;
		this.lebonus = this.Activatedroute.snapshot.queryParamMap.get('bonus') || 0;
		this.etapedujeu = this.Activatedroute.snapshot.queryParamMap.get('etape') || this.etapedujeu;
		this.pointdevies = parseInt(this.lavie.toString());
		this.router.routeReuseStrategy.shouldReuseRoute = () => false;
		this.router.onSameUrlNavigation = 'reload';
		this.gs.freeBlocksRemaining = 9;
		this.gs.initBlocks();
		this.lock = false;
		this.gs.turn = 0;
		this.rejouer = false;
		this.newGame();
	}

	newGame() {
		// this.gs.freeBlocksRemaining = 9;
		// this.gs.initBlocks();
		// this.lock = false;
		// this.gs.turn = 0;
	}

	resetjeu() {
		this.rejouer = false;
		this.gs.freeBlocksRemaining = 9;
		this.gs.initBlocks();
		this.lock = false;
		this.gs.turn = 0;
	}

	goToPlay(lavie: string | number, lebonus: string | number, letape: string | number) {
		this.router.navigate(['/play'], { queryParams: { vie: lavie, bonus: lebonus, etape: letape } });
	}

	resetGame(event: { preventDefault: () => void; }) {
		location.reload();
		event.preventDefault();
	}

	playerClick(i: number) {
		if (this.gs.blocks[i].free == false || this.lock == true) {
			return;
		}
		this.gs.freeBlocksRemaining -= 1;
		if (this.gs.freeBlocksRemaining <= 0) {
			this.gs.draw += 1;
			this.lock = true;
			this.snackBar.open("Match:", "Nul", {
				duration: 3000,
			});
			this.rejouer = true;
			this.newGame();
			return;
		}
		this.gs.blocks[i].free = false;
		if (this.gs.turn == 0) {
			this.gs.blocks[i].setValue("tick");
		} else {
			this.gs.blocks[i].setValue("cross");
		}
		var complete = this.gs.blockSetComplete();
		if (complete == false) {
			this.changeTurn();
			return;
		} else {
			this.lock = true;
			this.gs.players[this.gs.turn].score += 1;
			if ((this.gs.turn + 1) == 1) {
				this.incrementervie();
			}
			const texte: string = (this.gs.turn + 1) == 2 ? 'LYCO LE SAGE' : 'TOI';
			this.snackBar.open("Vainqueur:", texte, {
				duration: 3000,
			});
			this.rejouer = true;
			if (this.casuffit()) this.rejouer = false;
			this.newGame();
			return;
		}
	}

	incrementervie() {
		this.pointdevies += 500;
		this.lavie = this.pointdevies;
	}

	botTurn() {
		if (this.gs.freeBlocksRemaining <= 0) {
			return;
		}
		var bot_selected = this.gs.figureBotMove() - 1;
		if (this.gs.blocks[bot_selected].free == true) {
			this.playerClick(bot_selected);
		} else {
			this.botTurn();
			return;
		}
	}

	changeTurn() {
		var player = this.gs.changeTurn();
		if (player == 1) {
			this.botTurn();
		}
	}

	onrecommencer() {
		if ((this.lavie) && (this.lebonus)) { this.goToPlay(this.lavie, this.lebonus, this.etapedujeu); }
	}

	gagnant() { return this.gs.players[0].score != 0; }

	casuffit() { return this.pointdevies >= 10000; }

	oncontinue() { return this.pointdevies < 10000; }

}