import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

  lavie: number | string | undefined;
  succes: number | string | undefined;
  lebonus: number | string | undefined;
  etapedujeu: string = "0";
  titredelapage: string | undefined;
  texteboutonun: string | undefined;
  texteboutondeux: string | undefined;
  texteboutontrois: string | undefined;
  texteboutonquatre: string | undefined;
  texteboutoncinq: string | undefined;
  pointdevies: number = 0;
  pointdebonus: number = 0;

  constructor(private Activatedroute: ActivatedRoute, private router: Router, private cookieService: CookieService, private gameService: GameService) { }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    if (this.cookieService.check("etapejeu")) {
      this.etapedujeu = this.cookieService.get("etapejeu");
    } else {
      this.fixetape("0");
    }
    if (this.cookieService.check("pointdevies")) {
      this.lavie = this.cookieService.get("pointdevies");
    }
    this.lavie = this.Activatedroute.snapshot.queryParamMap.get('vie') || this.lavie;
    this.lebonus = this.Activatedroute.snapshot.queryParamMap.get('bonus') || 0;
    this.etapedujeu = this.Activatedroute.snapshot.queryParamMap.get('etape') || this.etapedujeu;
    if (this.lavie) this.pointdevies = parseInt(this.lavie.toString());
    if (this.lebonus) this.pointdebonus = parseInt(this.lebonus.toString());
    this.fixetape(this.etapedujeu);
    this.cookieService.set("pointdevies", this.pointdevies.toString());
    this.afficheetape(this.etapedujeu);
  }

  private fixetape(letape: string): void {
    this.etapedujeu = letape;
    this.cookieService.set("etapejeu", letape);
  }

  private afficheetape(letape: string): void {
    let montableau: string[] | undefined = this.gameService.queletape(letape);
    if (montableau) {
      this.titredelapage = montableau[0];
      this.texteboutonun = montableau[1];
      this.texteboutondeux = montableau[2];
      this.texteboutontrois = montableau[3];
      this.texteboutonquatre = montableau[4];
      this.texteboutoncinq = montableau[5];
    }
  }

  alleretapesuivante(letape: string): void {
    const monetape = this.gameService.etapesuivante(letape);
    this.cookieService.set("etapejeu", monetape);
    this.etapedujeu = monetape;
    this.afficheetape(monetape);
  }

  onVisualiser() {
    switch (this.etapedujeu) {
      case "0":
        this.goToTictac(this.lavie!, this.lebonus!, "1");
        break;
      case "1":
        this.goToboubou(this.pointdevies, this.pointdebonus, "2");
        break;
      case "2":
        this.goToKronos(this.pointdevies, this.pointdebonus, "3");
        break;
      default:
        this.alleretapesuivante(this.etapedujeu);
        break;
    }
  }

  goToTictac(lavie: string | number, lebonus: string | number, letape: string | number) {
    this.router.navigate(['/tictac'], { queryParams: { vie: lavie, bonus: lebonus, etape: letape } });
  }

  goToKronos(lavie: string | number, lebonus: string | number, letape: string | number) {
    this.router.navigate(['/kronos'], { queryParams: { vie: lavie, bonus: lebonus, etape: letape } });
  }

  goToboubou(lavie: string | number, lebonus: string | number, letape: string | number) {
    this.router.navigate(['/cards'], { queryParams: { vie: lavie, bonus: lebonus, etape: letape } });
  }

  onBoutondeux() {
    switch (this.etapedujeu) {
      case "0":
        this.lavie = 500;
        this.lebonus = 500;
        this.alleretapesuivante(this.etapedujeu)
        break;
      default:
        this.alleretapesuivante(this.etapedujeu);
        break;
    }
  }

  onBoutontrois() {
    switch (this.etapedujeu) {
      case "0":
        this.lavie = 500;
        this.lebonus = 500;
        this.alleretapesuivante(this.etapedujeu)
        break;
      default:
        this.alleretapesuivante(this.etapedujeu)
        break;
    }
  }

  onBoutonquatre() {
    switch (this.etapedujeu) {
      case "0":
        this.lavie = 500;
        this.lebonus = 500;
        this.alleretapesuivante(this.etapedujeu)
        break;
      default:
        this.alleretapesuivante(this.etapedujeu)
        break;
    }
  }

  onBoutoncinq() {
    switch (this.etapedujeu) {
      case "0":
        this.lavie = 500;
        this.lebonus = 500;
        this.alleretapesuivante(this.etapedujeu)
        break;
      default:
        this.alleretapesuivante(this.etapedujeu)
        break;
    }
  }

  onrecommencer() {
    this.cookieService.deleteAll();
    this.router.navigate(['/again']);
  }

}