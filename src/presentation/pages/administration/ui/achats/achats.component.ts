import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-achats',
  templateUrl: './achats.component.html',
  styleUrls: ['./achats.component.scss']
})
export class AchatsComponent implements OnInit {

  public module: string;
  public subModule: string;
  public initialView: boolean = true;
  public formsView: boolean = false;
  public listAchats: Array<any> = [];
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public filterDateStart: Date;
  public filterDateEnd: Date;
  public selectDateStart: any;
  public selectDateEnd: any;

  constructor(
    private route: ActivatedRoute

  ) { }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.module = data.module;
      this.subModule = data.subModule[3];
    });
  }

  public GetAllStock() {

  }

  public onInitForm() {

  }
  public onPageChange(event) {

  }

  public onFilter() {

  }
  changeDateStart(e) {
    this.selectDateStart = moment(this.filterDateStart).format('YYYY-MM-DD');
  }
  changeDateEnd(e) {
    this.selectDateEnd = moment(this.filterDateEnd).format('YYYY-MM-DD');
  }

  public isFilter() {

  }


}
