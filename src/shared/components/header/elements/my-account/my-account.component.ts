import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { handle } from 'src/shared/functions/api.function';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
import { SettingService } from 'src/shared/services/setting.service';
import { StoreCurrentUserService } from '../../../../services/store-current-user.service';
import { CurrentUser } from '../../../../interfaces/current-user.interface';
import { StoreTokenService } from '../../../../services/store-token.service';
import { CryptoToken } from '../../../../crypto-data/crypto-token';
const Swal = require('sweetalert2');

@Component({
    selector: 'app-my-account',
    templateUrl: './my-account.component.html',
    styleUrls: ['./my-account.component.scss'],
})
export class MyAccountComponent implements OnInit {
    public userName: string;
    public profileImg: 'assets/images/dashboard/profile.jpg';
    public currentUser: CurrentUser;
    public newPasswordValue: string;
    public confirmPasswordValue: string;
    public passwordForm: FormGroup;
    public submitted: boolean = false;
    public accountForm: FormGroup;

    constructor(
        private settingService: SettingService,
        private router: Router,
        private storage: EncodingDataService,
        private fb: FormBuilder,
        private modalService: NgbModal,
        private toastrService: ToastrService,
        private loadingBarService: LoadingBarService,
        private storeCurrentUserService: StoreCurrentUserService,
        private storeTokenService: StoreTokenService,
        private cryptoToken: CryptoToken
    ) {}

    ngOnInit() {
        this.currentUser = this.storeCurrentUserService
            .getCurrentUser as CurrentUser;
        this.initFormPassword();
        this.initFormAccount();
        // this.OnChangeNewPasswordvalue()
        // this.OnChangeConfirmPasswordvalue()
    }

    // Password
    public initFormPassword(): void {
        this.passwordForm = this.fb.group({
            old_password: [null, [Validators.required]],
            // new_password: [null, [Validators.required, CustomValidators.password]],
            // new_password_confirmation: [null, [Validators.required, CustomValidators.password]],
            new_password: [null, Validators.required],
            new_password_confirmation: [null, Validators.required],
        });
    }
    public openFormPassword(content) {
        this.modalService.open(content);
        this.passwordForm.reset();
    }
    public hideForm() {
        this.passwordForm.reset();
        this.modalService.dismissAll();
    }
    OnChangeNewPasswordvalue() {
        return this.passwordForm
            .get('nouveau_password')
            .valueChanges.subscribe((value) => {
                return (this.newPasswordValue = value);
            });
    }
    OnChangeConfirmPasswordvalue() {
        return this.passwordForm
            .get('confirm_password')
            .valueChanges.subscribe((value) => {
                return (this.confirmPasswordValue = value);
            });
    }

    // public handleUpdatePassword(): void {
    //   this.settingService
    //     .HandleUpdatePassword(this.passwordForm.value)
    //     .subscribe({
    //       next: (response) => {
    //         this.hideForm()
    //         this.router.navigateByUrl('auth/login')
    //           .then(() => window.location.reload());
    //         this.toastrService.success(response?.message);
    //       },
    //       error: (error) => {
    //         this.toastrService.error(error.error.message);
    //       }
    //     })
    // }

    async handleUpdatePassword(
        dataToSend: Object = this.passwordForm.value
    ): Promise<void> {
        this.submitted = true;
        if (
            this.passwordForm.get('new_password').value !==
            this.passwordForm.get('new_password_confirmation').value
        ) {
            this.passwordForm
                .get('new_password')
                ?.setErrors({ invalidPassword: true });
            this.passwordForm
                .get('new_password_confirmation')
                ?.setErrors({ invalidPassword: true });
        }
        if (this.passwordForm.valid) {
            const response: any = await handle(
                () => this.settingService.HandleUpdatePassword(dataToSend),
                this.toastrService,
                this.loadingBarService
            );
            if (response?.error === false) {
                this.handleSuccessful(response);
            }
        }
    }

    private handleSuccessful(response): void {
        this.toastrService.success(response.message);
        this.hideForm();
    }

    // Account
    public initFormAccount(): void {
        this.accountForm = this.fb.group({
            nom: ['', [Validators.required]],
            prenoms: ['', [Validators.required]],
            username: ['', [Validators.required]],
            email: ['', [Validators.required]],
            contacts: ['', [Validators.required]],
            adresse: ['', [Validators.required]],
            profil_user_id: [this.currentUser?.profil_user_id],
            user_id: [this.currentUser?.id],
        });
    }
    public openFormAccount(account, data) {
        this.accountForm.get('nom').patchValue(data.nom);
        this.accountForm.get('prenoms').patchValue(data.prenoms);
        this.accountForm.get('username').patchValue(data.username);
        this.accountForm.get('email').patchValue(data.email);
        this.accountForm.get('contacts').patchValue(data.contacts);
        this.accountForm.get('adresse').patchValue(data.adresse);
        this.accountForm.get('username').disable();
        this.modalService.open(account);
    }
    public hideFormAccount() {
        this.modalService.dismissAll();
        this.accountForm.reset();
    }

    public handleUpdateAdmin(): void {
        this.settingService.OnUpdateUser(this.accountForm.value).subscribe({
            next: (response) => {
                this.hideForm();
                this.router
                    .navigateByUrl('auth/login')
                    .then(() => window.location.reload());
                this.toastrService.success(response?.message);
            },
            error: (error) => {
                this.toastrService.error(error.error.message);
            },
        });
    }
    public handleLogout(): void {
        this.settingService.Logout({}).subscribe({
            next: (response) => {
                this.storeCurrentUserService.removeCurrentUser();
                this.storeTokenService.removeToken();
                this.storage.removeData('current_menu');
                this.storage.removeData('variables');
                this.storage.removeData('user');
                this.storage.removeData('token');
                // this.cryptoToken.clear();
                if (this.storage.getData('isProfil') || null) {
                    this.storage.removeData('isProfil');
                    window.location.reload();
                    // .then(() => window.location.reload());
                }
                this.router.navigateByUrl('auth/login');
                this.toastrService.success(response?.message);
            },
            error: (error) => {
                this.toastrService.error(error.error.message);
            },
        });
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
                this.handleLogout();
            }
        });
    }
}
