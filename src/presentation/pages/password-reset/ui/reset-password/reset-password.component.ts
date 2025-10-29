import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { LOGO_ANSUT } from 'src/shared/constants/logoAnsut.constant';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { AUTH } from 'src/shared/routes/full.routes';
import { LOGIN } from 'src/presentation/pages/authentication/authentication-routing.module';
import { PasswordResetService } from '../../data-access/password-reset.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
    public passwordForm = new FormGroup({
        password: new FormControl('', Validators.required),
        confirm_password: new FormControl('', Validators.required),
    });
    public submitted = false;
    public newPasswordValue: string;
    public confirmPasswordValue: string;
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
        return this.passwordForm
            .get('password')
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
