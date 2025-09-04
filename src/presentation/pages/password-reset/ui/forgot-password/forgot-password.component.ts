import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import { LOGO_IMAKO } from 'src/shared/constants/logoOrange.constant';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { PasswordResetService } from '../../data-access/password-reset.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
    forgotPasswordForm = new FormGroup({
        username: new FormControl('', [Validators.required, Validators.email]),
    });
    isModal: boolean = false;
    public submitted: boolean = false;
    public title =
        'Mot de passe oublié - Système de Gestion de Collecte Centralisée';
    public LOGO_IMAKO = LOGO_IMAKO;
    private response: any = {};

    constructor(
        private location: Location,
        private passwordResetService: PasswordResetService,
        private toastrService: ToastrService,
        private titleService: Title,
        private loadingBar: LoadingBarService
    ) {
        this.titleService.setTitle(`${this.title}`);
    }

    async onFormForgotPassword(): Promise<void> {
        this.submitted = true;
        if (this.forgotPasswordForm.valid) {
            // this.response = await handle(
            //     () =>
            //         this.passwordResetService.HandleForgotPassword(
            //             this.forgotPasswordForm.value
            //         ),
            //     this.toastrService,
            //     this.loadingBar
            // );
            // this.handleSuccessful(this.response);
        }
    }

    private handleSuccessful(response): void {
        this.isModal = true;
        this.toastrService.success(response.message);
    }

    handleOpen() {
        this.isModal = false;
    }
    onCancel() {
        this.location.back();
    }
}
