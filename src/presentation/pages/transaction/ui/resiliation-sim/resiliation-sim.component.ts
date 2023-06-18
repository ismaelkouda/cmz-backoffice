import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/shared/services/setting.service';

@Component({
  selector: 'app-resiliation-sim',
  templateUrl: './resiliation-sim.component.html',
  styleUrls: ['./resiliation-sim.component.scss']
})
export class ResiliationSimComponent implements OnInit {

  public listSuspensions: Array<any> = [];
  public listDirections: Array<any> = [];
  public listExploitations: Array<any> = [];
  public initialView: boolean = true;
  public formsView: boolean = false;
  public currentObject: any;
  public selectedDirection: any;
  public selectedExploitation: any;
  public selectedSim: string;
  public selectedimsi: string;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;

  constructor(
    public settingService: SettingService,
    public toastrService: ToastrService,
  ) { }

  ngOnInit() {

    this.isFilter();
  }

  public GetAllSuspensions() {

  }

  public onPageChange(event) {
    this.p = event;
    this.GetAllSuspensions()
  }

  public onFilter() {

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
  onChangeItem(event: any) {
    this.selectedDirection = event.value;
    this.listExploitations = this.selectedDirection?.exploitations.map(element => {
      return { ...element, fullName: `${element.nom} [${element.code}]` }
    });
  }
  public onInitForm(): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = undefined;
  }
  public pushStatutView(event: boolean): void {
    this.formsView = event;
    this.initialView = !event;
  }

  public pushListSuspensions(event: any): void {
    this.listSuspensions = event;
  }

  disableAction(): boolean {
    return null;
  }
  public isFilter(): boolean {
    return (!this.selectedDirection && !this.selectedSim && !this.selectedimsi) ? true : false
  }

}
