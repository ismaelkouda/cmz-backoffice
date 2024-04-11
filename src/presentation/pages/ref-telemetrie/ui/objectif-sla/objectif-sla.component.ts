import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/shared/services/setting.service';
import { MappingService } from 'src/shared/services/mapping.service';
import { SupervisionOperationService } from 'src/presentation/pages/supervision-operations/data-access/supervision-operation.service';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-objectif-sla',
  templateUrl: './objectif-sla.component.html',
  styleUrls: ['./objectif-sla.component.scss']
})
export class ObjectifSlaComponent implements OnInit {

  public listObjectifs: Array<any> = [];
  public currentTabsIndex: number;
  public applicationType: string;
  public title = 'Objectif SLA - Système de Gestion de Collecte Centralisée';
  constructor(
    private supervisionOperationService: SupervisionOperationService,
    private toastrService: ToastrService,
    private settingService: SettingService,
    private mappingService: MappingService,
    private titleService: Title
  ) {
    this.titleService.setTitle(`${this.title}`);
    this.applicationType = this.mappingService.applicationType;
  }

  ngOnInit() {
    this.GetAllSla()
    this.disableAction()
  }

  public GetAllSla(): void {
    this.supervisionOperationService
      .GetAllSla({})
      .subscribe({
        next: (response) => {          
          this.listObjectifs = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  handleChangeTabviewIndex(e) {
    this.currentTabsIndex = e.index;
    if (this.currentTabsIndex === 1) {
      this.settingService.statutSubject.next(true);
    }
  }

  public disableAction(): boolean {
    return this.listObjectifs?.length === 0 ? true : false
  }

}

