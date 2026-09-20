import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  etapes: Map<string, string[]> = new Map([
    ["0", ["THE NEW GAME", "LYKO LE SAGE", "Je le ferais plus-tard", "", "", "", "1"]],
    ["1", ["LA DIMENSION BLANCHE", "BOUBOUNI", "Je le ferais plus-tard", "", "", "", "2"]],
    ["2", ["LA DIMENSION BLANCHE", "LE DE DE KRONOS ", "Je le ferais plus-tard", "", "", "", "3"]],
    ["3", ["LA DIMENSION ROUGE", "CONTINUEZ", "", "", "", "", "4"]],
    ["4", ["LA DIMENSION BLANCHE", "AVANCER", "", "", "", "", "5"]],
    ["5", ["LA DIMENSION BLANCHE", "GAGNER", "", "", "", "", "6"]],
    ["6", ["LA DIMENSION BLANCHE", "NOIR", "ROUGE", "VERT", "BLEU", "BLANC", "6"]]
  ]);

  constructor() { }

  etapesuivante(letape: string): string {
    let montableau: string[] | undefined = this.etapes.get(letape);
    if (montableau) {
      return montableau[6];
    } else {
      return letape;
    }
  }

  queletape(letape: string): string[] | undefined {
    return this.etapes.get(letape);
  }

}
