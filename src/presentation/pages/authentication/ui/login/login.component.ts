import { handle } from '../../../../../shared/functions/api.function';
import { LOGO_ORANGE } from '../../../../../shared/constants/logoOrange.constant';
import { REINITIALISATION } from '../../../../app-routing.module';
import { menuJson } from './../../../../../assets/menu';
import { AuthenticationService } from './../../data-access/authentication.service';
import { Component, OnInit, Pipe } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoadingBarService } from '@ngx-loading-bar/core';

// @ts-ignore
import { environment } from 'src/environments/environment.prod';
import { FORGOT_PASSWORD } from '../../../password-reset/password-reset-routing.module';
import { EncodingDataService } from '../../../../../shared/services/encoding-data.service';
import { DASHBOARD } from '../../../../../shared/routes/routes';
import { AsFeatureService } from '../../../../../shared/services/as-feature.service';
import { MappingService } from '../../../../../shared/services/mapping.service';
import { StoreCurrentUserService } from '../../../../../shared/services/store-current-user.service';
import { StoreTokenService } from '../../../../../shared/services/store-token.service';
import { CryptoToken } from '../../../../../shared/crypto-data/crypto-token';
import {
    BehaviorSubject,
    catchError,
    debounceTime,
    finalize,
    of,
    Subject,
    switchMap,
    takeUntil,
} from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
    loginForm = new FormGroup({
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
        port: new FormControl(''),
    });
    public show: boolean = false;
    public siteKey: string;
    public permissionsJson: any = [];
    readonly REINITIALISATION = REINITIALISATION;
    readonly FORGOT_PASSWORD = FORGOT_PASSWORD;
    public LOGO_ORANGE = LOGO_ORANGE;
    private loadingFetchLoginSubject = new BehaviorSubject<boolean>(false);

    constructor(
        private authenticationService: AuthenticationService,
        private router: Router,
        private toastService: ToastrService,
        private storage: EncodingDataService,
        private loadingBarService: LoadingBarService,
        private storeCurrentUserService: StoreCurrentUserService,
        private storeTokenService: StoreTokenService,
        private asFeatureService: AsFeatureService
    ) {
        this.permissionsJson = menuJson;
    }

    ngOnInit() {
        this.siteKey = environment.recaptcha.siteKey;
    }

    public fetchLogin(): void {
        if (this.loadingFetchLoginSubject.getValue()) return;
        this.loadingFetchLoginSubject.next(true);
        this.authenticationService
            .OnLogin(this.loginForm.value)
            .pipe(
                debounceTime(1000),
                catchError((error) => {
                    console.error('Error fetching login', error);
                    return of([]);
                }),
                finalize(() => this.loadingFetchLoginSubject.next(false))
            )
            .subscribe((response: any) => {
                this.handleSuccessful(response);
            });
    }

    private async handleSuccessful(response): Promise<void> {
        this.toastService.success(
            `Bienvenue ${response?.data?.user?.nom} ${response?.data?.user?.prenoms}`
        );
        const currentUser = response.data?.user;
        const token = response.data?.token;
        this.storage.saveData('user', JSON.stringify(currentUser));
        this.storage.saveData('token', JSON.stringify(token));

        this.storeCurrentUserService.setCurrentUser(currentUser);
        this.storeTokenService.setToken(token);
        // await this.cryptoToken.saveTokenData('token', token);
        this.storage.saveData(
            'menu',
            JSON.stringify(response.data?.user?.permissions)
        );
        this.getVariables();
        // this.storage.saveData("current_menu", JSON.stringify(this.permissionsJson))
        // this.storeLocaleService.OnEmitTenantData(response?.data)
        // this.storeLocaleService.OnEmitCurrentPermission(this.permissionsJson)
    }

    async getVariables() {
        const response = await handle(
            () => this.authenticationService.getVariables({}),
            this.toastService,
            this.loadingBarService
        );
        if (!response.error) {
            this.asFeatureService.setAsAccessFeature(response.data.modules);
            this.storage.saveData(
                'modules',
                JSON.stringify(response.data.modules)
            );
            this.storage.saveData('variables', JSON.stringify(response.data));
            this.router.navigateByUrl(`/${DASHBOARD}`);
        }
    }
}
