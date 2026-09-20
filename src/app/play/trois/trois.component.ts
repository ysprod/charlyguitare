import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-trois',
  templateUrl: './trois.component.html',
  styleUrls: ['./trois.component.css']
})
export class TroisComponent implements OnInit {

  @Input() vie: string | undefined;
  @Input() bonus: string | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
