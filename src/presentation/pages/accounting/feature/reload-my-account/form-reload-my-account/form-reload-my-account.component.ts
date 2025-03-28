import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MappingService } from "../../../../../../shared/services/mapping.service";
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { LoadingBarService } from "@ngx-loading-bar/core";
const Swal = require('sweetalert2');
import { SWALWITHBOOTSTRAPBUTTONSPARAMS } from '../../../../../../shared/constants/swalWithBootstrapButtonsParams.constant';
import { handle } from '../../../../../../shared/functions/api.function';
import { ACCOUNTING } from '../../../../../../shared/routes/routes';
import { RELOAD_MY_ACCOUNT } from "../../../accounting-routing.module";
import { TranslateService } from "@ngx-translate/core";
import { reloadMyAccountFormInterface } from "../../../data-access/reload-my-account/interfaces/reload-my-account-form.interface";
import { ReloadMyAccountApiService } from "../../../data-access/reload-my-account/service/reload-my-account-api.service";
import { SharedService } from "../../../../../../shared/services/shared.service";
import { BankInterface } from "../../../../../../shared/interfaces/bank.interface";
import { formDataBuilder } from "../../../../../../shared/constants/formDataBuilder.constant";
import { reloadMyAccountFilterInterface } from "../../../data-access/reload-my-account/interfaces/reload-my-account-filter.interface";
import { T_MODE_PAYMENT } from "../../../data-access/reload-my-account/types/mode-payment.type";
import * as moment from 'moment';

type TYPEVIEW = 'reload-my-account';
const TYPEVIEW_VALUES: TYPEVIEW[] = ['reload-my-account'];
function isTypeView(value: any): value is TYPEVIEW {
    return TYPEVIEW_VALUES.includes(value);
}

@Component({
    selector: 'app-form-reload-my-account',
    templateUrl: './form-reload-my-account.component.html',
    styleUrls: ['./form-reload-my-account.component.scss']
})

export class FormReloadMyAccountComponent {
    public module: string;
    public subModule: string;
    public urlParamRef: TYPEVIEW;
    public displayUrlErrorPage: boolean = false;
    public formFundMyAccount: FormGroup;
    public listBanks$: Observable<Array<BankInterface>>;

    constructor(private activatedRoute: ActivatedRoute,
        private loadingBarService: LoadingBarService, private toastrService: ToastrService,
        private fb: FormBuilder, private translate: TranslateService,
        public mappingService: MappingService, private router: Router,
        private reloadMyAccountApiService: ReloadMyAccountApiService, private sharedService: SharedService,) {
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[2];
        });
        this.activatedRoute.queryParams.subscribe((params: Object) => {
            this.urlParamRef = params?.["ref"];
        });
        this.getParamsInUrl();
    }

    private getParamsInUrl(): void {
        if (!isTypeView(this.urlParamRef)) {
            this.displayUrlErrorPage = true;
        } else {
            this.initFormFundReloadMyAccount();
            this.sharedService.fetchBanks();
            this.listBanks$ = this.sharedService.getBanks();
        }
    }

    public initFormFundReloadMyAccount(): void {
        this.formFundMyAccount = this.fb.group<reloadMyAccountFormInterface>({
            mode_paiement: new FormControl<T_MODE_PAYMENT>('depot', { nonNullable: true }),
            code_banque: new FormControl<string>('', { nonNullable: true }),
            reference: new FormControl<string>('', { nonNullable: true }),
            montant: new FormControl<string>('', { nonNullable: true }),
            date_remise: new FormControl<string>('', { nonNullable: true }),
            titulaire: new FormControl<string>('', { nonNullable: true }),
            numero: new FormControl<string>('', { nonNullable: true }),
            password: new FormControl<string>('', { nonNullable: true }),
            justificatif: new FormControl<File | null>(null, { validators: Validators.required, nonNullable: true })
        });
    }

    public onChangeFile(file: FileList) {
        const selectedFile = file.item(0);
        this.formFundMyAccount.patchValue({ justificatif: selectedFile });
    }

    async handleFundReloadMyAccount(): Promise<void> {
        const SOMETHING_WENT_WRONG = this.translate.instant('SOMETHING_WENT_WRONG');
        const CONFIRM_THE_TRANSACTION_BY = this.translate.instant('CONFIRM_THE_TRANSACTION_BY');
        const mode_paiement = this.formFundMyAccount.get('mode_paiement')?.value;
        if (this.formFundMyAccount.valid) {
            const result = await Swal.mixin({ customClass: SWALWITHBOOTSTRAPBUTTONSPARAMS.customClass }).fire({ ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message, html: `<span><strong>${CONFIRM_THE_TRANSACTION_BY}</strong></span><span style="color: #569C5B;"> ${mode_paiement}</span>` })
            if (result.isConfirmed) {
                const date_debut = this.formFundMyAccount.get("date_remise")?.value;
                const format_date = moment(date_debut).format('YYYY-MM-DD')
                const response: any = await handle(() => this.reloadMyAccountApiService.creditReloadMyAccount(formDataBuilder({ ...this.formFundMyAccount.value, date_remise: format_date })), this.toastrService, this.loadingBarService);
                if (response.error === false) {
                    this.reloadMyAccountApiService.fetchReloadMyAccount({} as reloadMyAccountFilterInterface);
                    this.closeInterface();
                } else {
                    this.toastrService.error(response.message);
                }
            }
        } else {
            this.toastrService.error(SOMETHING_WENT_WRONG);
        }
    }

    public closeInterface(): void {
        this.router.navigate([ACCOUNTING + "/" + RELOAD_MY_ACCOUNT]);
    }

}