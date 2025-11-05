import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { LOGO_ANSUT } from '../../../../../shared/constants/logoAnsut.constant';
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
    public LOGO_ANSUT = LOGO_ANSUT;
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

    handleOpen() {
        this.isModal = false;
    }
    onCancel() {
        this.location.back();
    }
}
