import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-un',
  templateUrl: './un.component.html',
  styleUrls: ['./un.component.css']
})
export class UnComponent implements OnInit {

  @Input() monid: string | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
