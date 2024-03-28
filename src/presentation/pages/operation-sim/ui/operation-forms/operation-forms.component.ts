import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/shared/services/setting.service';

@Component({
  selector: 'app-operation-forms',
  templateUrl: './operation-forms.component.html',
  styleUrls: ['./operation-forms.component.scss']
})
export class OperationFormsComponent implements OnInit {

  public selectedValue: string;
  public responseDatas: Array<any> = [];
  public operationDatas: any = {};
  public listDirectionRegionales: Array<any> = [];
  public listExploitations: Array<any> = [];

  constructor(
    private settingService: SettingService,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
    this.isFilter();
    this.isVerify();
    this.getAllDirectionRegionales()
  }

  public getAllDirectionRegionales(): void {
    this.settingService
      .GetAllFirstLevelSimple({})
      .subscribe({
        next: (response) => {
          this.listDirectionRegionales = response['data']
        },
        error: (error) => {
          this.toastrService.error(error.message)
        }
      })
  }

  public onChangeItem(event) {
    const currentValue = event.value;
    this.listExploitations = currentValue?.exploitations;
    if (currentValue === null) {
      this.listExploitations = [];
    }
  }

  public onVerify() {
    this.operationDatas = {
      lable: 'label',
      description: 'description'
    }
    setTimeout(() => {
      this.selectedValue = null
    }, 1000);
  }
  public isFilter(): boolean {
    return !this.selectedValue ? true : false
  }

  public isVerify(): boolean {
    return (Object.keys(this.operationDatas).length === 0) ? true : false
  }
}
