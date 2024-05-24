import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from 'src/presentation/pages/authentication/data-access/authentication.service';
import { LOGO_ORANGE } from 'src/shared/constants/logoOrange.constant';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { handle } from "src/shared/functions/api.function";
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html'
})

export class ForgotPasswordComponent {
  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  })
  isModal: boolean = false;
  public title = 'Mot de passe oublié - Système de Gestion de Collecte Centralisée';
  public LOGO_ORANGE = LOGO_ORANGE;
  private response: any = {};

  constructor(private location: Location, private authenticationService: AuthenticationService,
    private toastrService: ToastrService, private titleService: Title,
    private loadingBar: LoadingBarService
  ) { this.titleService.setTitle(`${this.title}`); }

  async HandleForgotPassword() {
    this.response = await handle(() => this.authenticationService.HandleForgotPassword(this.forgotPasswordForm.value), this.toastrService, this.loadingBar);
    this.handleSuccessful(this.response);
  }

  private handleSuccessful(response): void {
    this.isModal = true 
    this.toastrService.success(response.message);
  }

  handleOpen(){
    this.isModal = false
  } 
  onCancel() {
    this.location.back()
  }
}
