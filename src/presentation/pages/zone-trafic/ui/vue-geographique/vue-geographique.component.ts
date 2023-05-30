import { ZoneTraficService } from './../../data-access/zone-trafic.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/shared/services/setting.service';

@Component({
  selector: 'app-vue-geographique',
  templateUrl: './vue-geographique.component.html',
  styleUrls: ['./vue-geographique.component.scss']
})
export class VueGeographiqueComponent implements OnInit {

  public datas: any;
  public currentZone: any;
  public display: boolean = false;
  public maxi: boolean;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public listDirections: Array<any> = [];
  public listExploitations: Array<any> = [];
  public listZonesExploitations: Array<any> = [];
  public selectedDirection: any;
  public selectedExploitation: any;
  public selectedSim: any;

  constructor(
    private zoneTraficService: ZoneTraficService,
    private toastrService: ToastrService,
    private settingService: SettingService
  ) { }

  ngOnInit() {
    this.getAllExploiatations();
    this.getAllDirectionRegionales();
    this.isFilter();
    this.disableAction()
  }

  public getAllExploiatations() {
    this.settingService
      .getAllExploiatations({})
      .subscribe({
        next: (response) => {
          this.listZonesExploitations = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.message);
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
  showMap(data) {
    if (data.poste_distributions_count === 0) {
      return
    } else {
      this.currentZone = data;
      this.GetPositionSimGeojson(data.id);
      this.maxi = false;
    }
  }

  hideDialog() {
    this.display = false;
  }

  onChangeItem(event: any) {
    this.selectedDirection = event.value;
    this.listExploitations = this.selectedDirection?.exploitations.map(element => {
      return { ...element, fullName: `${element.nom} [${element.code}]` }
    });
  }

  onMaximized(e) {
    this.maxi = e.maximized;
  }
  public isFilter(): boolean {
    return this.selectedDirection == null ? true : false
  }
  public onFilter() {
    this.settingService
      .getAllExploiatations({
        direction_regionale_id: this.selectedDirection?.id,
        exploitation: this.selectedExploitation?.code,
      })
      .subscribe({
        next: (response) => {
          this.listZonesExploitations = response['data'];
          console.log("");

        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  GetPositionSimGeojson(id: number) {
    this.zoneTraficService
      .GetPositionSimGeojson({
        exploitation_id: id
      }).subscribe({
        next: (response) => {
          this.datas = response.data;
          this.display = true;
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  public disableAction(): boolean {
    return (this.listZonesExploitations === undefined || this.listZonesExploitations?.length === 0) ? true : false
  }
}
