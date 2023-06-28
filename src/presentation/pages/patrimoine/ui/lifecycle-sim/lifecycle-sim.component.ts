import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/shared/services/setting.service';
import { PatrimoineService } from '../../data-access/patrimoine.service';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-lifecycle-sim',
  templateUrl: './lifecycle-sim.component.html',
  styleUrls: ['./lifecycle-sim.component.scss']
})
export class LifecycleSimComponent implements OnInit {

  public listCycles: any;
  public listDirections: Array<any> = [];
  public listExploitations: Array<any> = [];
  public selectedDirection: any;
  public selectedExploitation: any;
  public selectedSim: string;
  public selectedimsi: string;
  public selectDateStart: any;
  public selectDateEnd: any;
  public filterDateStart: Date;
  public filterDateEnd: Date;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;

  constructor(
    public toastrService: ToastrService,
    public settingService: SettingService,
    private patrimoineService: PatrimoineService,
    private clipboardApi: ClipboardService,
  ) {
    this.filterDateStart = new Date();
    this.filterDateEnd = new Date();
    this.selectDateStart = moment(this.filterDateStart).format('YYYY-MM-DD');
    this.selectDateEnd = moment(this.filterDateEnd).format('YYYY-MM-DD');
  }

  ngOnInit() {
    this.GetAllCycles();
    this.getAllDirectionRegionales()
  }


  public GetAllCycles() {
    this.patrimoineService
      .GetAllCycles({}, this.p)
      .subscribe({
        next: (response) => {
          this.listCycles = response.data.data;
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  public onPageChange(event) {
    this.p = event;
    // if (this.isFilter()) {
    //   this.GetAllPatrimoines()
    // } else {
    //   this.onFilter()
    // }
  }
  public getAllDirectionRegionales() {
    this.settingService
      .getAllDirectionRegionales({})
      .subscribe({
        next: (response) => {
          this.listDirections = response.data
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  public onChangeItem(event: any) {
    this.selectedDirection = event.value;
    this.listExploitations = this.selectedDirection?.niveaux_deux.map(element => {
      return { ...element, fullName: `${element.nom} [${element.code}]` }
    });
  }
  changeDateStart(e) {
    this.selectDateStart = moment(this.filterDateStart).format('YYYY-MM-DD');
  }
  changeDateEnd(e) {
    this.selectDateEnd = moment(this.filterDateEnd).format('YYYY-MM-DD');
  }

  onFilter() {

  }
  isFilter() {

  }

}
