import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab-view-header',
  templateUrl: './tab-view-header.component.html',
  styleUrls: ['./tab-view-header.component.scss']
})
export class TabViewHeaderComponent implements OnInit {

  @Input() legende: string;
  constructor() { }

  ngOnInit() {
  }

}
