import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/shared/services/setting.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  public listUsers: Array<any> = [];
  public selectedProfil: any;
  public selectedUSer: any;
  public initialView: boolean = true;
  public formsView: boolean = false;
  public currentObject: any;

  constructor(
    private settingService: SettingService,
    private toastrService: ToastrService,
    private clipboardApi: ClipboardService,
  ) { }

  ngOnInit() {
    this.GetAllUsers()
  }
  public GetAllUsers() {
    this.settingService.getAllUsers({})
      .subscribe({
        next: (response) => {
          this.listUsers = response['data']
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  onFilter(){}

  public copyData(data: any): void {
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }

  public onInitForm(): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = undefined;
  }
  public onEditForm(data: any): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = data;
  }
  public onShowForm(data: any): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = { ...data, show: true };
  }
  public pushStatutView(event: boolean): void {
    this.formsView = event;
    this.initialView = !event;
  }
  public pushListDatas(event: any): void {
    this.listUsers = event;
  }
}
