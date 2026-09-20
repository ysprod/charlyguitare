export class Block {

  free: boolean = true;
  value: string = "";
  symbol: string = "";

  setValue(value: string) {
    this.value = value;
    if (this.value == "tick") {
      this.symbol = "done";
    } else {
      this.symbol = "close";
    }
  }

  urlimg(): string {
    return this.symbol == 'done' ? 'assets/bleu.jpg' : 'assets/gblanc.jpg'
  }

}
