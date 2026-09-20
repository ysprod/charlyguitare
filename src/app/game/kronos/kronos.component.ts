import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-kronos',
	templateUrl: './kronos.component.html',
	styleUrls: ['./kronos.component.css']
})
export class KronosComponent implements OnInit {

	rejouer = false;
	etapedujeu: string = "0";
	lavie: number | string | undefined;
	lebonus: number | string | undefined;
	randomnumber: number | string | undefined;
	pointdevies: number = 0;
	pointdebonus: number = 0;

	constructor(private Activatedroute: ActivatedRoute, private router: Router) { }

	ngOnInit(): void {
		this.lavie = this.Activatedroute.snapshot.queryParamMap.get('vie') || 0;
		this.lebonus = this.Activatedroute.snapshot.queryParamMap.get('bonus') || 0;
		this.etapedujeu = this.Activatedroute.snapshot.queryParamMap.get('etape') || this.etapedujeu;
		this.pointdevies = parseInt(this.lavie.toString());
		this.router.routeReuseStrategy.shouldReuseRoute = () => false;
		this.router.onSameUrlNavigation = 'reload';
		this.rejouer = false;
	}

	resetjeu() {
		this.rejouer = true;
		this.randomnumber = this.randomInteger(0, 11);
		this.pointdevies -= 1000;
		this.pointdevies = this.pointdevies * this.randomnumber;
		this.lavie = this.pointdevies;
	}

	goToPlay(lavie: string | number, lebonus: string | number, letape: string | number) {
		this.router.navigate(['/play'], { queryParams: { vie: lavie, bonus: lebonus, etape: letape } });
	}

	incrementervie() {
		this.pointdevies += 500;
		this.lavie = this.pointdevies;
	}

	onrecommencer() {
		if ((this.lavie) && (this.lebonus)) { this.goToPlay(this.lavie, this.lebonus, this.etapedujeu); }
	}

	gagnant() { return false; }

	casuffit() { return this.pointdevies >= 10000; }

	oncontinue() { return this.pointdevies < 10000; }

	randomInteger(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

}
