import { AuthenticationService } from './../../data-access/authentication.service';
import { StoreLocaleService } from '../../../../../shared/services/store-locale.service';
import { EncodingDataService } from '../../../../../shared/services/encoding-data.service';
import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

// @ts-ignore
import { environment } from 'src/environments/environment.prod';
import { menuJson } from 'src/assets/menu';
import { FORGOT_PASSWORD } from '../../../password-reset/password-reset-routing.module';
import { REINITIALISATION } from 'src/presentation/app-routing.module';
import { DASHBOARD } from 'src/shared/routes/routes';
import { Title } from '@angular/platform-browser';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  public show: boolean = false
  public siteKey: string;
  public permissionsJson: any = [];
  readonly REINITIALISATION = REINITIALISATION;
  readonly FORGOT_PASSWORD = FORGOT_PASSWORD;
  public title = 'Connexion - Système de Gestion de Collecte Centralisée';


  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private toastService: ToastrService,
    private storage: EncodingDataService,
    private titleService: Title,
    private storeLocaleService: StoreLocaleService
  ) {
    this.titleService.setTitle(`${this.title}`);
    this.permissionsJson = menuJson;
  }

  ngOnInit() {
    this.siteKey = environment.recaptcha.siteKey;
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
      port: [''],
    });

  }

  onLogin() {
    this.loginForm.patchValue({port: '11200'})
    this.authService.OnLogin(this.loginForm.value).subscribe({
      next: (response) => {        
        this.permissionsJson.map(module => {
          if (module?.children) {
            module?.children.map((sous_module,index) => {
              if (module.data === "1-0-0-patrimoine" && response['data']['permissions'].includes(sous_module.data)) {
                this.permissionsJson[0] = { ...module, statut: true }
              }
              if (module.data === "9-0-0-demandes-de-services" && response['data']['permissions'].includes(sous_module.data)) {
                this.permissionsJson[1] = { ...module, statut: true }
              }
              if (module.data === "2-0-0-referentiel-telemetrie" && response['data']['permissions'].includes(sous_module.data)) {
                this.permissionsJson[2] = { ...module, statut: true }
              }
              if (module.data === "3-0-0-gestion-portefeuille" && response['data']['permissions'].includes(sous_module.data)) {
                this.permissionsJson[3] = { ...module, statut: true }
              }
              if (module.data === "4-0-0-suivi-operations" && response['data']['permissions'].includes(sous_module.data)) {
                this.permissionsJson[4] = { ...module, statut: true }
              }
              if (module.data === "5-0-0-supervision-sim" && response['data']['permissions'].includes(sous_module.data)) {
                this.permissionsJson[5] = { ...module, statut: true }
              }
              if (module.data === "8-0-0-sla-demandes-de-services" && response['data']['permissions'].includes(sous_module.data)) {
                this.permissionsJson[6] = { ...module, statut: true }
              }
              if (module.data === "6-0-0-parametres-securite" && response['data']['permissions'].includes(sous_module.data)) {
                this.permissionsJson[7] = { ...module, statut: true }
              }
            })
          }
        })
        this.storage.saveData('user', JSON.stringify(response.data));
        this.storage.saveData("current_menu", JSON.stringify(this.permissionsJson))
        this.storeLocaleService.OnEmitTenantData(response?.data)
        this.storeLocaleService.OnEmitCurrentPermission(this.permissionsJson)
        this.router.navigateByUrl(`/${DASHBOARD}`)
        this.toastService.success(`Bienvenue ${response.data.nom} ${response.data.prenoms}`); 
      },
      error: (error) => {        
        this.toastService.error(error.error.message);
      }
    })
  }
}
