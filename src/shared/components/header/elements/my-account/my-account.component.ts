import {
    Component,
    ElementRef,
    HostListener,
    OnDestroy,
    OnInit,
    TemplateRef,
    inject,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SWEET_ALERT_PARAMS } from '@shared/constants/swalWithBootstrapButtonsParams.constant';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import SweetAlert from 'sweetalert2';
import { CurrentUser } from '../../../../interfaces/current-user.interface';
import { EncodingDataService } from '../../../../services/encoding-data.service';
import { MyAccountFacade } from './application/my-account.facade';

@Component({
    selector: 'app-my-account',
    standalone: true,
    templateUrl: './my-account.component.html',
    styleUrls: ['./my-account.component.scss'],
    imports: [ReactiveFormsModule],
})
export class MyAccountComponent implements OnInit, OnDestroy {
    private readonly toastService = inject(ToastrService);
    private readonly translate = inject(TranslateService);
    private readonly myAccountFacade = inject(MyAccountFacade);
    private readonly encodingDataService = inject(EncodingDataService);
    private readonly ngbModal = inject(NgbModal);
    private readonly elementRef = inject(ElementRef);
    private readonly fb = inject(FormBuilder);
    public currentUser!: CurrentUser | null;
    public newPasswordValue!: string;
    public confirmPasswordValue!: string;
    public passwordForm!: FormGroup;
    public submitted = false;
    public accountForm!: FormGroup;
    private readonly destroy$ = new Subject<void>();

    isDropdownOpen = false;

    toggleDropdown(): void {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    closeDropdown(): void {
        this.isDropdownOpen = false;
    }

    openAccountModal(): void {
        this.closeDropdown();
        // Ouvrir modal compte
    }

    openPasswordModal(): void {
        this.closeDropdown();
        // Ouvrir modal mot de passe
    }

    logout(): void {
        this.closeDropdown();
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant('LOGOUT.SWEET_ALERT_PARAMS.CONFIRM'),
            text: this.translate.instant(
                this.translate.instant('LOGOUT.SWEET_ALERT_PARAMS.MESSAGES')
            ),
            backdrop: false,
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

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.closeDropdown();
        }
    }

    ngOnInit() {
        const user = this.encodingDataService.getData(
            'user_data'
        ) as CurrentUser | null;
        this.currentUser = user;
        this.initFormPassword();
        this.initFormAccount();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public initFormPassword(): void {
        this.passwordForm = this.fb.group({
            old_password: [null, [Validators.required]],
            new_password: [null, Validators.required],
            new_password_confirmation: [null, Validators.required],
        });
    }

    public openFormPassword(modalRef: TemplateRef<any>) {
        this.ngbModal.open(modalRef);
        this.passwordForm.reset();
    }

    public hideForm() {
        this.passwordForm.reset();
        this.ngbModal.dismissAll();
    }

    async handleUpdatePassword(
        dataToSend: object = this.passwordForm.value
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
    }

    public initFormAccount(): void {
        this.accountForm = this.fb.group({
            last_name: ['', [Validators.required]],
            first_name: ['', [Validators.required]],
            email: ['', [Validators.required]],
            phone: ['', [Validators.required]],
            id: [this.currentUser?.id],
        });
    }

    public openFormAccount(
        modalRef: TemplateRef<any>,
        currentUser: CurrentUser | null
    ) {
        this.accountForm.get('last_name')?.patchValue(currentUser?.last_name);
        this.accountForm.get('first_name')?.patchValue(currentUser?.first_name);
        this.accountForm.get('email')?.patchValue(currentUser?.email);
        this.accountForm.get('phone')?.patchValue(currentUser?.phone);
        this.ngbModal.open(modalRef);
    }

    public hideFormAccount() {
        this.ngbModal.dismissAll();
        this.accountForm.reset();
    }
}
