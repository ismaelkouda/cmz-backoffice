import { ToastrService } from 'ngx-toastr';
import { SupervisionSystemeService } from './../../data-access/supervision-systeme.service';
import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/shared/services/setting.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-etats-services',
  templateUrl: './etats-services.component.html',
  styleUrls: ['./etats-services.component.scss']
})
export class EtatsServicesComponent implements OnInit {

  listEtatServices: Array<any> = [];
  listDirections: Array<any> = [];
  listExploitations: Array<any> = [];
  selectedDirection: any;
  selectedSim: string;
  selectedExploitation: any;
  public title = 'Etats services - Système de Gestion de Collecte Centralisée';
  constructor(
    private supervisionSystemeService: SupervisionSystemeService,
    private settingService: SettingService,
    private toastrService: ToastrService,
    private titleService: Title
  ) {
    this.titleService.setTitle(`${this.title}`);
  }

  ngOnInit() {
    this.GetAllEtatServices();
    this.getAllDirectionRegionales();
    this.isFilter()
  }

  public GetAllEtatServices() {
    this.supervisionSystemeService
      .GetAllEtatServices({})
      .subscribe({
        next: (response) => {
          this.listEtatServices = response['data']
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }

  public getAllDirectionRegionales() {
    this.settingService
      .GetAllFirstLevelSimple({})
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

  onFilter() {

  }

  public isFilter(): boolean {
    return this.selectedDirection == null ? true : false
  }
}
