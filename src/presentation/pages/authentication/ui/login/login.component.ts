import { AuthenticationService } from 'src/presentation/pages/authentication/data-access/authentication.service';
import { StoreLocaleService } from 'src/shared/services/store-locale.service';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
import { Component, OnInit } from "@angular/core";
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { LoadingBarService } from '@ngx-loading-bar/core';

// @ts-ignore
import { environment } from 'src/environments/environment.prod';
import { menuJson } from 'src/assets/menu';
import { FORGOT_PASSWORD } from '../../../password-reset/password-reset-routing.module';
import { REINITIALISATION } from 'src/presentation/app-routing.module';
import { DASHBOARD } from 'src/shared/routes/routes';
import { Title } from '@angular/platform-browser';
import { LOGO_ORANGE } from 'src/shared/constants/logoOrange.constant';
import { handle } from "src/shared/functions/api.function";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html"
})

export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    port: new FormControl(''),
  });
  public show: boolean = false
  public siteKey: string;
  public permissionsJson: any = [];
  readonly REINITIALISATION = REINITIALISATION;
  readonly FORGOT_PASSWORD = FORGOT_PASSWORD;
  public title = 'Connexion - Système de Gestion de Collecte Centralisée';
  public LOGO_ORANGE = LOGO_ORANGE;
  private response: any = {};

  constructor(private authenticationService: AuthenticationService,
    private router: Router, private toastrService: ToastrService,
    private storage: EncodingDataService, private titleService: Title,
    private storeLocaleService: StoreLocaleService, private loadingBarService: LoadingBarService
  ) {
    this.titleService.setTitle(`${this.title}`);
    this.permissionsJson = menuJson;
  }

  ngOnInit() {
    this.siteKey = environment.recaptcha.siteKey;
  }

  async onLogin() {
    this.loginForm.patchValue({ port: window.location.port })
    this.response = await handle(() => this.authenticationService.OnLogin(this.loginForm.value), this.toastrService, this.loadingBarService);
    this.handleSuccessful(this.response);
  }


  private handleSuccessful(response): void {
    this.permissionsJson.forEach((module, index) => {
      if (module.children) {
        module.children.forEach((sous_module) => {
          const found = response['data'].permissions.includes(sous_module.data);
          if (found) {
            this.permissionsJson[index] = { ...module, statut: true };
          }
        });
      }
    });
    this.storage.saveData('user', JSON.stringify(response.data));
    this.storage.saveData("current_menu", JSON.stringify(this.permissionsJson))
    this.storeLocaleService.OnEmitTenantData(response?.data)
    this.storeLocaleService.OnEmitCurrentPermission(this.permissionsJson)
    this.router.navigateByUrl(`/${DASHBOARD}`)
    this.toastrService.success(`Bienvenue ${response.data.nom} ${response.data.prenoms}`);
  }
}
