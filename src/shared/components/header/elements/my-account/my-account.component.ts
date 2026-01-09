import { CommonModule } from '@angular/common';
import {
    Component,
    ElementRef,
    HostListener,
    inject,
    OnDestroy,
    OnInit,
    signal,
    TemplateRef,
    viewChild,
} from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SWEET_ALERT_PARAMS } from '@shared/constants/swalWithBootstrapButtonsParams.constant';
import { ToastrService } from 'ngx-toastr';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { Subject, takeUntil } from 'rxjs';
import SweetAlert from 'sweetalert2';
import { CurrentUser } from '../../../../interfaces/current-user.interface';
import { EncodingDataService } from '../../../../services/encoding-data.service';
import { MyAccountFacade } from './application/my-account.facade';
import { ChangePasswordRequestDto } from './data/dtos/change-password-request.dto';
import { UpdateProfileRequestDto } from './data/dtos/update-profile-request.dto';

@Component({
    selector: 'app-my-account',
    standalone: true,
    templateUrl: './my-account.component.html',
    styleUrls: ['./my-account.component.scss'],
    imports: [CommonModule, ReactiveFormsModule, PasswordModule, InputMaskModule, TranslateModule],
})
export class MyAccountComponent implements OnInit, OnDestroy {
    private readonly toastService = inject(ToastrService);
    private readonly translate = inject(TranslateService);
    private readonly myAccountFacade = inject(MyAccountFacade);
    private readonly encodingDataService = inject(EncodingDataService);
    private readonly ngbModal = inject(NgbModal);
    private readonly elementRef = inject(ElementRef);
    private readonly fb = inject(FormBuilder);
    public readonly currentUser = signal<CurrentUser | null>(null);
    public accountForm!: FormGroup;
    public passwordForm!: FormGroup;
    private readonly destroy$ = new Subject<void>();

    private readonly passwordModalTemplate = viewChild<TemplateRef<unknown>>('passwordV');
    private readonly accountModalTemplate = viewChild<TemplateRef<unknown>>('accountV');

    public isDropdownOpen = signal<boolean>(false);

    public toggleDropdown(): void {
        this.isDropdownOpen.set(!this.isDropdownOpen());
    }

    public closeDropdown(): void {
        this.isDropdownOpen.set(false);
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.closeDropdown();
        }
    }

    public openAccountModal(): void {
        this.closeDropdown();
        const template = this.accountModalTemplate();
        if (template) {
            this.openFormAccount(template);
        }
    }

    private openFormAccount(modalRef: TemplateRef<unknown>): void {
        this.ngbModal.dismissAll();
        const user = this.currentUser();
        this.accountForm.reset();
        this.accountForm.patchValue({
            last_name: user?.last_name,
            first_name: user?.first_name,
            email: user?.email,
            phone: user?.phone,
            id: user?.id,
        });
        this.ngbModal.open(modalRef, {
            centered: true,
            backdrop: 'static',
            keyboard: false,
        });
    }

    public openPasswordModal(): void {
        this.closeDropdown();
        const template = this.passwordModalTemplate();
        if (template) {
            this.openFormPassword(template);
        }
    }

    private openFormPassword(modalRef: TemplateRef<any>): void {
        this.ngbModal.dismissAll();
        this.passwordForm.reset();
        this.ngbModal.open(modalRef, {
            centered: true,
            backdrop: 'static',
            keyboard: false,
        });
    }

    public logout(): void {
        this.ngbModal.dismissAll();
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            confirmButtonColor: '#dc3545',
            title: this.translate.instant('LOGOUT.SWEET_ALERT_PARAMS.CONFIRM'),
            text: this.translate.instant('LOGOUT.SWEET_ALERT_PARAMS.MESSAGES'),
            confirmButtonText: this.translate.instant(
                'LOGOUT.SWEET_ALERT_PARAMS.BUTTONS'
            ),
            cancelButtonText: this.translate.instant('CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.myAccountFacade.logout();
                this.encodingDataService.clearData();
                this.closeDropdown();
                globalThis.window.location.reload();
            }
        });
    }

    ngOnInit() {
        const user = this.encodingDataService.getData(
            'user_data'
        ) as CurrentUser | null;
        this.currentUser.set(user);
        this.initFormPassword();
        this.initFormAccount();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public initFormPassword(): void {
        this.passwordForm = this.fb.group(
            {
                old_password: [null, [Validators.required]],
                new_password: [null, [Validators.required, Validators.minLength(6)]],
                confirm_new_password: [
                    null,
                    [Validators.required, Validators.minLength(6)],
                ],
            },
            { validators: this.passwordsMatchValidator }
        );
    }

    private passwordsMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
        const password = group.get('new_password')?.value;
        const confirmPassword = group.get('confirm_new_password')?.value;
        return password === confirmPassword ? null : { notMatching: true };
    }

    get oldPassword(): AbstractControl<string> | null {
        return this.passwordForm.get('old_password');
    }

    get newPassword(): AbstractControl<string> | null {
        return this.passwordForm.get('new_password');
    }

    get confirmNewPassword(): AbstractControl<string> | null {
        return this.passwordForm.get('confirm_new_password');
    }

    public isFieldInvalidPassword(fieldName: 'old_password' | 'new_password' | 'confirm_new_password'): boolean {
        const control = this.passwordForm.get(fieldName);
        return !!(control && control.invalid && control.touched);
    }

    public isFieldValidPassword(fieldName: 'old_password' | 'new_password' | 'confirm_new_password'): boolean {
        const control = this.accountForm.get(fieldName);
        return !!(control && control.valid && control.touched);
    }

    public getFieldErrorPassword(fieldName: 'new_password' | 'confirm_new_password'): string | null {
        const control = this.passwordForm.get(fieldName);
        if (!control || !control.errors || !control.touched) {
            return null;
        }

        if (control.errors['minlength']) {
            return 'MY_ACCOUNT.PASSWORD.FORM.INVALID_FORMAT';
        }

        if (this.passwordForm.hasError('notMatching') && fieldName === 'confirm_new_password') {
            return 'MY_ACCOUNT.PASSWORD.FORM.NOT_MATCH';
        }

        return null;
    }

    public initFormAccount(): void {
        this.accountForm = this.fb.group({
            last_name: ['', [Validators.required]],
            first_name: ['', [Validators.required]],
            email: [
                '',
                [Validators.required, Validators.email, Validators.minLength(6)],
            ],
            phone: [
                '',
                [
                    Validators.required,
                    Validators.pattern(/^(07|05|03)\d{8}$/),
                ],
            ],
            id: [this.currentUser()?.id],
        });
    }

    get lastName(): AbstractControl<string> | null {
        return this.accountForm.get('last_name');
    }

    get firstName(): AbstractControl<string> | null {
        return this.accountForm.get('first_name');
    }

    get email(): AbstractControl<string> | null {
        return this.accountForm.get('email');
    }

    get phone(): AbstractControl<string> | null {
        return this.accountForm.get('phone');
    }

    public isFieldInvalidAccount(fieldName: 'email' | 'phone' | 'first_name' | 'last_name'): boolean {
        const control = this.accountForm.get(fieldName);
        return !!(control && control.invalid && control.touched);
    }

    public isFieldValidAccount(fieldName: 'email' | 'phone' | 'first_name' | 'last_name'): boolean {
        const control = this.accountForm.get(fieldName);
        return !!(control && control.valid && control.touched);
    }

    public get fieldErrorEmail(): string | null {
        const control = this.accountForm.get('email');
        if (!control || !control.errors || !control.touched) {
            return null;
        }

        if (control.errors['email']) {
            return 'MY_ACCOUNT.ACCOUNT.FORM.INVALID_FORMAT';
        }

        if (control.errors['minlength']) {
            return 'MY_ACCOUNT.ACCOUNT.FORM.INVALID_FORMAT';
        }

        return null;
    }

    public get fieldErrorPhone(): string | null {
        const control = this.accountForm.get('phone');
        if (!control || !control.errors || !control.touched) {
            return null;
        }

        if (control.errors['pattern']) {
            return 'MY_ACCOUNT.ACCOUNT.FORM.INVALID_START';
        }

        return null;
    }

    handleUpdatePassword(): void {
        if (this.passwordForm.invalid) {
            return;
        }

        const payload: ChangePasswordRequestDto = {
            ...this.passwordForm.value,
            new_password_confirmation: this.passwordForm.value.confirm_new_password
        };

        this.myAccountFacade
            .updatePassword(payload)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.toastService.success(
                    this.translate.instant('MY_ACCOUNT.MESSAGES.SUCCESS.PASSWORD_UPDATED')
                );
                this.hideFormPassword();
            });
    }

    public handleUpdateAccount(): void {
        if (this.accountForm.invalid) {
            return;
        }

        const payload: UpdateProfileRequestDto = {
            ...this.accountForm.value,
        };

        this.myAccountFacade
            .updateProfile(payload)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.toastService.success(
                    this.translate.instant('MY_ACCOUNT.MESSAGES.SUCCESS.PROFILE_UPDATED')
                );
                const updatedUser = { ...this.currentUser(), ...payload } as CurrentUser;
                this.encodingDataService.saveData('user_data', updatedUser);
                this.currentUser.set(updatedUser);
                this.hideFormAccount();
            });
    }

    public hideFormPassword() {
        this.passwordForm.reset();
        this.ngbModal.dismissAll();
    }

    public hideFormAccount() {
        this.accountForm.reset();
        this.ngbModal.dismissAll();
    }
}
