import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/presentation/pages/authentication/data-access/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { LOGO_ORANGE } from 'src/shared/constants/logoOrange.constant';
import { handle } from "src/shared/functions/api.function";
import { LoadingBarService } from '@ngx-loading-bar/core';
import { AUTH } from "src/shared/routes/full.routes";
import { LOGIN } from "src/presentation/pages/authentication/authentication-routing.module";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})

export class ResetPasswordComponent implements OnInit {

  public passwordForm = new FormGroup({
    password: new FormControl('', Validators.required),
    confirm_password: new FormControl('', Validators.required),
  });
  public newPasswordValue: string;
  public confirmPasswordValue: string;
  public queryValue: any
  public title = 'Réinitialisation mot de passe - Système de Gestion de Collecte Centralisée';
  public LOGO_ORANGE = LOGO_ORANGE;
  private response: any = {};

  constructor(private router: Router, private route: ActivatedRoute,
    private authenticationService: AuthenticationService, private toastrService: ToastrService,
    private titleService: Title, private loadingBar: LoadingBarService
  ) { this.titleService.setTitle(`${this.title}`); }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.queryValue = params
    });
    this.OnChangeNewPasswordvalue()
    this.OnChangeConfirmPasswordvalue()
  }

  OnChangeNewPasswordvalue() {
    return this.passwordForm
      .get('password')
      .valueChanges.subscribe((value) => {        
        return this.newPasswordValue = value;
      });
  }
  OnChangeConfirmPasswordvalue() {
    return this.passwordForm
      .get('confirm_password')
      .valueChanges.subscribe((value) => { 
        return this.confirmPasswordValue = value;
      });
  }

  async HandleResetPassword() {
    this.response = await handle(() => this.authenticationService.HandleResetPassword({...this.passwordForm.value,...this.queryValue}), this.toastrService, this.loadingBar);
    this.handleSuccessful(this.response);
  }

  private handleSuccessful(response): void {
    this.router.navigateByUrl(`/${AUTH}/${LOGIN}`)        
    this.toastrService.success(response.data.message);
  }

  public onCancel() {
    this.passwordForm.reset()
    this.router.navigateByUrl(`/${AUTH}/${LOGIN}`)
  }
}
