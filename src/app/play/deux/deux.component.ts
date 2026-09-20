import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-deux',
  templateUrl: './deux.component.html',
  styleUrls: ['./deux.component.css']
})
export class DeuxComponent implements OnInit {

  @Input() letitre: string | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
