import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/shared/services/setting.service';

@Component({
  selector: 'app-courbe-message',
  templateUrl: './courbe-message.component.html',
  styleUrls: ['./courbe-message.component.scss']
})
export class CourbeMessageComponent implements OnInit {

  public listAnalysesAlarmes: Array<any> = [];
  public listDirectionRegionales: Array<any> = [];
  public listExploitations: Array<any> = [];
  public selectedDirection: any;
  public selectedExploitation: any;
  public selectedSim: string;

  constructor(
    private settingService: SettingService,
    private toastrService: ToastrService,


  ) { }

  ngOnInit() {
    this.GetAllAnalyseAlarmes();
    this.getAllDirectionRegionales();
    this.isFilter();
    this.disableAction()
  }

  public GetAllAnalyseAlarmes() {

  }

  public getAllDirectionRegionales(): void {
    this.settingService
      .getAllDirectionRegionales({})
      .subscribe({
        next: (response) => {
          this.listDirectionRegionales = response['data']
        },
        error: (error) => {
          this.toastrService.error(error.message)
        }
      })
  }

  onChangeItem(event: any) {
    this.selectedDirection = event.value;
    this.listExploitations = this.selectedDirection?.exploitations.map(element => {
      return { ...element, fullName: `${element.nom} [${element.code}]` }
    });
  }

  public isFilter(): boolean {
    return this.selectedDirection == null ? true : false
  }

  onFilter() {

  }

  public disableAction(): boolean {
    return this.listAnalysesAlarmes?.length === 0 ? true : false
  }


}
