import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cinq',
  templateUrl: './cinq.component.html',
  styleUrls: ['./cinq.component.css']
})
export class CinqComponent implements OnInit {

  @Input() moncinq: string | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  valider(s: string): boolean { return this.moncinq == s; }

}
