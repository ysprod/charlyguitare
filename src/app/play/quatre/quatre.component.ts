import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-quatre',
  templateUrl: './quatre.component.html',
  styleUrls: ['./quatre.component.css']
})
export class QuatreComponent implements OnInit {

  @Input() monquatre: string | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  valider(test: string): boolean { return this.monquatre == test; }

}
