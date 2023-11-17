import { Component, OnInit } from '@angular/core';
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
    private toastrService: ToastrService
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

  public onInitForm(): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = undefined;
  }
  onFilter() {

  }
}
