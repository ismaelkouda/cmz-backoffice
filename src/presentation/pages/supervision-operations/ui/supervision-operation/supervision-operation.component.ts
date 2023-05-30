import { Component, Inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-supervision-operation',
  templateUrl: './supervision-operation.component.html',
  styleUrls: ['./supervision-operation.component.scss'],
})
export class SupervisionOpeationComponent implements OnInit {

  constructor(
    private title: Title,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.title.setTitle('Vue génerale de supervision | PATRIMOINE SIM');
  }

  /**
   * @author André ATCHORI
   */

  ngOnInit() {
    this.document.body.classList.add('body__background');
  }
}
