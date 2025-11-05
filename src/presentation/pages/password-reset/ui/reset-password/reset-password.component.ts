import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { PasswordModule } from 'primeng/password';
import { LOGO_ANSUT } from '../../../../../shared/constants/logoAnsut.constant';
import { AUTH } from '../../../../../shared/routes/full.routes';
import { LOGIN } from '../../../authentication/authentication-routing.module';
import { PasswordResetService } from '../../data-access/password-reset.service';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    templateUrl: './reset-password.component.html',
    imports: [ReactiveFormsModule, PasswordModule],
})
export class ResetPasswordComponent implements OnInit {
    public passwordForm = new FormGroup({
        password: new FormControl('', Validators.required),
        confirm_password: new FormControl('', Validators.required),
    });
    public submitted = false;
    public newPasswordValue: string | null = null;
    public confirmPasswordValue: string | null = null;
    public queryValue: any;
    public title =
        'Réinitialisation mot de passe - Système de Gestion de Collecte Centralisée';
    public LOGO_ANSUT = LOGO_ANSUT;
    private response: any;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private passwordResetService: PasswordResetService,
        private toastrService: ToastrService,
        private titleService: Title,
        private loadingBarService: LoadingBarService
    ) {
        this.titleService.setTitle(`${this.title}`);
    }

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            this.queryValue = params;
        });
        this.OnChangeNewPasswordvalue();
        this.OnChangeConfirmPasswordvalue();
    }

    OnChangeNewPasswordvalue() {
        const control = this.passwordForm.get('password');
        if (!control || !control.valueChanges) return;
        return control.valueChanges.subscribe((value) => {
            this.newPasswordValue = value;
        });
    }
    OnChangeConfirmPasswordvalue() {
        const control = this.passwordForm.get('confirm_password');
        if (!control || !control.valueChanges) return;
        return control.valueChanges.subscribe((value) => {
            this.confirmPasswordValue = value;
        });
    }

    async onResetPassword() {
        this.submitted = true;
        if (this.passwordForm.invalid) return;
        // const response: any = await handle(
        //     () =>
        //         this.passwordResetService.HandleResetPassword({
        //             ...this.passwordForm.value,
        //             ...this.queryValue,
        //         }),
        //     this.toastrService,
        //     this.loadingBarService
        // );
        // if (response.error === false) this.handleSuccessful(response);
    }

    private handleSuccessful(response: any): void {
        this.toastrService.success(response.message);
        this.redirectToLogin();
    }

    public onCancel() {
        this.passwordForm.reset();
        this.redirectToLogin();
    }

    private redirectToLogin() {
        this.router.navigateByUrl(`/${AUTH}/${LOGIN}`);
    }
}
