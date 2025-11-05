import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { CurrentUser } from '../../../../interfaces/current-user.interface';
import { EncodingDataService } from '../../../../services/encoding-data.service';
const Swal = require('sweetalert2');

@Component({
    selector: 'app-my-account',
    templateUrl: './my-account.component.html',
    styleUrls: ['./my-account.component.scss'],
})
export class MyAccountComponent implements OnInit, OnDestroy {
    public userName!: string;
    public profileImg!: 'assets/images/dashboard/profile.jpg';
    public currentUser!: CurrentUser | null;
    public newPasswordValue!: string;
    public confirmPasswordValue!: string;
    public passwordForm!: FormGroup;
    public submitted: boolean = false;
    public accountForm!: FormGroup;

    private destroy$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private modalService: NgbModal,
        private toastrService: ToastrService,
        private encodingService: EncodingDataService
    ) {}

    ngOnInit() {
        const user = this.encodingService.getData(
            'user_data'
        ) as CurrentUser | null;
        this.currentUser = user;
        this.initFormPassword();
        this.initFormAccount();
        // this.OnChangeNewPasswordvalue()
        // this.OnChangeConfirmPasswordvalue()
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
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
    public openFormPassword(modalRef: TemplateRef<any>) {
        this.modalService.open(modalRef);
        this.passwordForm.reset();
    }
    public hideForm() {
        this.passwordForm.reset();
        this.modalService.dismissAll();
    }
    OnChangeNewPasswordvalue() {
        return this.passwordForm
            .get('nouveau_password')
            ?.valueChanges.subscribe((value) => {
                this.newPasswordValue = value;
                return value;
            });
    }
    OnChangeConfirmPasswordvalue() {
        return this.passwordForm
            .get('confirm_password')
            ?.valueChanges.subscribe((value) => {
                this.confirmPasswordValue = value;
                return value;
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
            this.passwordForm.get('new_password')?.value !==
            this.passwordForm.get('new_password_confirmation')?.value
        ) {
            this.passwordForm
                .get('new_password')
                ?.setErrors({ invalidPassword: true });
            this.passwordForm
                .get('new_password_confirmation')
                ?.setErrors({ invalidPassword: true });
        }
        if (this.passwordForm.valid) {
        }
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
    public openFormAccount(
        modalRef: TemplateRef<any>,
        currentUser: CurrentUser | null
    ) {
        this.accountForm.get('nom')?.patchValue(currentUser?.nom);
        this.accountForm.get('prenoms')?.patchValue(currentUser?.prenoms);
        this.accountForm.get('username')?.patchValue(currentUser?.username);
        this.accountForm.get('email')?.patchValue(currentUser?.email);
        this.accountForm.get('contacts')?.patchValue(currentUser?.contacts);
        this.accountForm.get('adresse')?.patchValue(currentUser?.adresse);
        this.accountForm.get('username')?.disable();
        this.modalService.open(modalRef);
    }
    public hideFormAccount() {
        this.modalService.dismissAll();
        this.accountForm.reset();
    }

    public handleUpdateAdmin(): void {
        // this.settingService.OnUpdateUser(this.accountForm.value).subscribe({
        //     next: (response) => {
        //         this.hideForm();
        //         this.router
        //             .navigateByUrl('auth/login')
        //             .then(() => window.location.reload());
        //         this.toastrService.success(response?.message);
        //     },
        //     error: (error) => {
        //         this.toastrService.error(error.error.message);
        //     },
        // });
    }
    public handleLogout(): void {
        // this.settingService.Logout({}).subscribe({
        //     next: (response) => {
        //         // this.currentUserService.removeCurrentUser();
        //         this.encodingService.removeData('token_data');
        //         this.encodingService.removeData('menu');
        //         this.encodingService.removeData('dashboard_links');
        //         this.encodingService.removeData('user_data');
        //         this.encodingService.removeData('token_data');
        //         this.encodingService.removeData('modules');
        //         // this.cryptoToken.clear();
        //         if (this.encodingService.getData('isProfil') || null) {
        //             this.encodingService.removeData('isProfil');
        //             window.location.reload();
        //             // .then(() => window.location.reload());
        //         }
        //         this.router.navigateByUrl('auth/login');
        //         this.toastrService.success(response?.message);
        //     },
        //     error: (error) => {
        //         this.toastrService.error(error.error.message);
        //     },
        // });
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
        }).then((result: any) => {
            if (result.isConfirmed) {
                this.handleLogout();
            }
        });
    }
}
