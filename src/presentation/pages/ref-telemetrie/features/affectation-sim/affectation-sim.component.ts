import { SettingService } from './../../../../../shared/services/setting.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TelemetrieService } from '../../data-access/telemetrie.service';

@Component({
  selector: 'app-affectation-sim',
  templateUrl: './affectation-sim.component.html',
  styleUrls: ['./affectation-sim.component.scss']
})
export class AffectationSimComponent implements OnInit {

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
    private telemetrieService: TelemetrieService,
    private settingService: SettingService
  ) { }

  ngOnInit() {
    this.GetAllListAffectationBySim();
    this.getAllDirectionRegionales();
    this.isFilter()
  }

  public GetAllProfilSupervision(): void {
    this.telemetrieService
      .GetAllProfilSupervision({})
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

  public GetAllListAffectationBySim() {
    this.telemetrieService
      .GetAllListAffectationBySim(this.currentObject?.id, this.p)
      .subscribe({
        next: (response) => {
          this.listAffectations = response.data.data;
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;
          // this.listconfigCheckedTrue =
          //   this.listAffectations.filter((data) => {
          //     return data.checked === true;
          //   });
          // this.listconfigCheckedTrue.forEach((c) => {
          //   this.checkconsumerList.push(c.id);
          // });
          // if (this.listAffectations.length === this.listconfigCheckedTrue.length) {
          //   this.checkedAllConsumers = true;
          // }
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  public onPageChange(event) {
    this.p = event;
    this.GetAllListAffectationBySim()
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
    this.telemetrieService
      .handleSaveAffectation({
        profil_id: this.currentObject?.id,
        sims: this.checkconsumerList
      })
      .subscribe({
        next: (response) => {
          this.GetAllProfilSupervision();
          this.toastrService.success(response.message);
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
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

  public onFilter() {
    let filterTab: string = '';
    if (this.selectedDirection !== undefined && this.selectedDirection !== null) {
      filterTab += `&direction_regionale_id=${this.selectedDirection?.id}`;
    }
    console.log("selectedSim", this.selectedSim);
    console.log("selectedDirection", this.selectedDirection);

    if (this.selectedSim) {
      filterTab += `&msisdn=${this.selectedSim}`;
    }
    this.telemetrieService
      .GetAllListAffectationBySim(this.currentObject?.id, `${this.p}${filterTab}`)
      .subscribe({
        next: (response) => {
          this.listAffectations = response.data.data;
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
  public isFilter(): boolean {
    return (!this.selectedDirection && !this.selectedSim) ? true : false
  }


}
