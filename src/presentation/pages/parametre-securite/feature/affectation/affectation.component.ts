import { ParametreSecuriteService } from './../../data-access/parametre-securite.service';
import { SettingService } from '../../../../../shared/services/setting.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-affectation',
  templateUrl: './affectation.component.html',
  styleUrls: ['./affectation-sim.component.scss']
})
export class AffectationComponent implements OnInit {

  listAffectations: any[] = [];
  @Output() affectationView = new EventEmitter();
  @Input() currentObject;
  @Output() listProfils = new EventEmitter();
  public display: boolean = false;
  public checkedAllConsumers: boolean = false;
  public checkedconsumer: boolean = false;
  public listconfigCheckedTrue: any[] = [];
  public checkconsumerList: any[] = [];
  public listDirections: Array<any> = [];
  public listExploitations: Array<any> = [];
  public selectedDirection: any;
  public selectedExploitation: any;
  public selectedSim: any;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;

  constructor(
    private toastrService: ToastrService,
    private settingService: SettingService,
    private parametreSecuriteService: ParametreSecuriteService
  ) { }

  ngOnInit() {
    this.GetAllUsersWithoutProfil();
    this.isFilter()
  }

  public GetAllProfilHabilitations(): void {
    this.parametreSecuriteService
      .GetAllProfilHabilitations({})
      .subscribe({
        next: (response) => {
          this.listProfils.emit(response['data']);
          this.close();
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public GetAllUsersWithoutProfil() {
    this.parametreSecuriteService
      .GetAllUsersWithoutProfil({})
      .subscribe({
        next: (response) => {
          this.listAffectations = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  public onCheckedOneConsumer(consumer: any) {
    if (this.checkconsumerList.includes(consumer.id)) {
      this.checkconsumerList.forEach((value, index) => {
        if (value == consumer.id)
          this.checkconsumerList.splice(index, 1);
      });
    } else if (!this.checkconsumerList.includes(consumer.id)) {
      this.checkconsumerList.push(consumer.id);
    }
    if (this.checkconsumerList.length === this.listAffectations.length) {
      this.checkedAllConsumers = true;
    } else {
      this.checkedAllConsumers = false;
    }
  }
  public OnCheckAllConsumer() {
    this.checkconsumerList = [];
    if (this.checkedAllConsumers) {
      this.listAffectations.forEach((consumer) => {
        consumer.checked = true;
        this.checkconsumerList.push(consumer.id);
      });
    } else {
      this.listAffectations.forEach((consumer) => {
        consumer.checked = false;
      });
      this.checkconsumerList.splice(0, this.checkconsumerList.length);
    }
  }
  public close(): void {
    this.affectationView.emit(false);
  }

  public handleSaveAffectation() {
    this.parametreSecuriteService
      .handleAffectation({
        profil_user_id: this.currentObject?.id,
        users: this.checkconsumerList
      })
      .subscribe({
        next: (response) => {
          this.GetAllProfilHabilitations();
          this.toastrService.success(response.message);
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public onFilter() {

  }
  public isFilter(): boolean {
    return true;
    // return (!this.selectedDirection && !this.selectedSim) ? true : false
  }


}
