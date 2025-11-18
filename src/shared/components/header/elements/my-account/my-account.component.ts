import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { CurrentUser } from '../../../../interfaces/current-user.interface';
import { EncodingDataService } from '../../../../services/encoding-data.service';

@Component({
    selector: 'app-my-account',
    standalone: true,
    templateUrl: './my-account.component.html',
    styleUrls: ['./my-account.component.scss'],
    imports: [ReactiveFormsModule],
})
export class MyAccountComponent implements OnInit, OnDestroy {
    public currentUser!: CurrentUser | null;
    public newPasswordValue!: string;
    public confirmPasswordValue!: string;
    public passwordForm!: FormGroup;
    public submitted = false;
    public accountForm!: FormGroup;
    private destroy$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private modalService: NgbModal,
        private toastService: ToastrService,
        private encodingService: EncodingDataService
    ) {}

    ngOnInit() {
        const user = this.encodingService.getData(
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
        this.modalService.open(modalRef);
        this.passwordForm.reset();
    }

    public hideForm() {
        this.passwordForm.reset();
        this.modalService.dismissAll();
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
        this.modalService.open(modalRef);
    }

    public hideFormAccount() {
        this.modalService.dismissAll();
        this.accountForm.reset();
    }
}
