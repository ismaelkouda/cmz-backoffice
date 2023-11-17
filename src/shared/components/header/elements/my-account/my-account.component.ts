import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { EncodingDataService } from "src/shared/services/encoding-data.service";
import { SettingService } from "src/shared/services/setting.service";
const Swal = require('sweetalert2');


@Component({
  selector: "app-my-account",
  templateUrl: "./my-account.component.html",
  styleUrls: ["./my-account.component.scss"],
})
export class MyAccountComponent implements OnInit {

  public userName: string;
  public profileImg: "assets/images/dashboard/profile.jpg";
  public currentUser: any;
  public newPasswordValue: string;
  public confirmPasswordValue: string;
  public passwordForm: FormGroup;
  public accountForm: FormGroup;

  
  constructor(
    private settingService: SettingService,
    private router: Router,
    private storage: EncodingDataService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(this.storage.getData('user'));
    this.initFormPassword()
    this.initFormAccount()
    this.OnChangeNewPasswordvalue()
    this.OnChangeConfirmPasswordvalue()
  }

  // Password
  public initFormPassword(): void {
    this.passwordForm = this.fb.group({
      actuel_password: ['',[Validators.required]],
      nouveau_password: ['',[Validators.required]],
      confirm_password: ['',[Validators.required]],

    });
  }
  public openFormPassword(content) {
    this.modalService.open(content);
    this.passwordForm.reset()
  }
  public hideForm() {
    this.modalService.dismissAll();
    this.passwordForm.reset();
  }
  OnChangeNewPasswordvalue() {
    return this.passwordForm
      .get('nouveau_password')
      .valueChanges.subscribe((value) => {        
        return this.newPasswordValue = value;
      });
  }
  OnChangeConfirmPasswordvalue() {
    return this.passwordForm
      .get('confirm_password')
      .valueChanges.subscribe((value) => { 
        return this.confirmPasswordValue = value;
      });
  }

  public handleUpdatePassword(): void {
    this.settingService
      .HandleUpdatePassword(this.passwordForm.value)
      .subscribe({
        next: (response) => {
          this.hideForm()
          this.router.navigateByUrl('auth/login')
        .then(() => window.location.reload());
        this.toastrService.success(response?.message);
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

    // Account
    public initFormAccount(): void {
      this.accountForm = this.fb.group({
        nom: ['',[Validators.required]],
        prenoms: ['',[Validators.required]],
        email: ['',[Validators.required]],
        contacts: ['',[Validators.required]],
        adresse: ['',[Validators.required]]
      });
    }
    public openFormAccount(account,data) {
      this.accountForm.get('nom').patchValue(data.nom);
      this.accountForm.get('prenoms').patchValue(data.prenoms);
      this.accountForm.get('email').patchValue(data.email);
      this.accountForm.get('contacts').patchValue(data.contacts);
      this.accountForm.get('adresse').patchValue(data.adresse);
      this.accountForm.get('email').disable();
      this.modalService.open(account);
    }
    public hideFormAccount() {
      this.modalService.dismissAll();
      this.accountForm.reset();
    }

    public handleUpdateAdmin(): void {
      this.settingService
        .OnUpdateUser(this.accountForm.value)
        .subscribe({
          next: (response) => {
            this.hideForm()
            this.router.navigateByUrl('auth/login')
          .then(() => window.location.reload());
              this.toastrService.success(response?.message);
          },
          error: (error) => {
            this.toastrService.error(error.error.message);
          }
        })
    }

    public logout(): void {
      Swal.fire({
        title: 'En êtes vous sûr ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#569C5B',
        cancelButtonColor: '#dc3545',
        cancelButtonText: 'Annuler',
        confirmButtonText: 'Oui',
      }).then((result) => {
        if (result.isConfirmed) {
          this.storage.removeData('user');
          this.storage.removeData('current_menu');
          this.router.navigateByUrl('auth/login');

        }
      });
    }
}
