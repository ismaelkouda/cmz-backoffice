import { MODE_PAYMENT_ENUM } from './../../../../../../shared/enum/mode-payment.enum';
import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MappingService } from "../../../../../../shared/services/mapping.service";
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { LoadingBarService } from "@ngx-loading-bar/core";
const Swal = require('sweetalert2');
import { SWALWITHBOOTSTRAPBUTTONSPARAMS } from '../../../../../../shared/constants/swalWithBootstrapButtonsParams.constant';
import { handle } from '../../../../../../shared/functions/api.function';
import { ACCOUNTING } from '../../../../../../shared/routes/routes';
import { MY_RELOADS } from "../../../accounting-routing.module";
import { TranslateService } from "@ngx-translate/core";
import { reloadMyAccountFormInterface } from "../../../data-access/reload-my-account/interfaces/reload-my-account-form.interface";
import { ReloadMyAccountApiService } from "../../../data-access/reload-my-account/service/reload-my-account-api.service";
import { SharedService } from "../../../../../../shared/services/shared.service";
import { BankInterface } from "../../../../../../shared/interfaces/bank.interface";
import { formDataBuilder } from "../../../../../../shared/constants/formDataBuilder.constant";
import { reloadMyAccountFilterInterface } from "../../../data-access/reload-my-account/interfaces/reload-my-account-filter.interface";
import { T_MODE_PAYMENT } from "../../../data-access/reload-my-account/types/mode-payment.type";
import * as moment from 'moment';
import { AgencyBenefitInterface, BankBenefitInterface } from '../../../../../../shared/interfaces/bank-beneficiaire.interface';
import { dateNotInPastValidator } from '../../../../../../shared/functions/control-date.function';
import { ReloadAccountOperationDetailsInterface } from '../../../data-access/reload-my-account/interfaces/transaction-details.interface';

type TYPEVIEW = 'reload-my-account' | 'details-reload-my-account' | 'edit-reload-my-account';
const TYPEVIEW_VALUES: TYPEVIEW[] = ['reload-my-account', 'details-reload-my-account', 'edit-reload-my-account'];
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
    public urlParamTransaction: string;
    public displayUrlErrorPage: boolean = false;
    public formFundMyAccount: FormGroup<reloadMyAccountFormInterface>;
    public listBanks$: Observable<Array<BankInterface>>;
    public listBanksBenefit$: Observable<Array<BankBenefitInterface>>;
    public listAgencyBenefit$: Observable<Array<AgencyBenefitInterface>>;
    public transactionDetails$: Observable<ReloadAccountOperationDetailsInterface>
    public filePreviewUrl: string | null = null;
    private destroy$ = new Subject<void>();

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
            this.getParamsInUrl();
        });
    }

    private getParamsInUrl(): void {
        if (!isTypeView(this.urlParamRef)) {
            this.displayUrlErrorPage = true;
            return;
        } else {
            this.initFormFundReloadMyAccount();
            const isDetailsOrEdit = this.urlParamRef === 'details-reload-my-account' || this.urlParamRef === 'edit-reload-my-account';
            if (isDetailsOrEdit) {
                this.urlParamTransaction = this.activatedRoute.snapshot.paramMap.get('transaction') ?? '';

                this.reloadMyAccountApiService.fetchTransactionDetails(this.urlParamTransaction);
                this.transactionDetails$ = this.reloadMyAccountApiService.getTransactionDetails();
                this.reloadMyAccountApiService.isLoadingTransactionDetails().pipe(takeUntil(this.destroy$))
                    .subscribe((isLoading: boolean) => {
                        if (isLoading) {
                            this.patchValueFormFundReloadMyAccount(this.transactionDetails$);
                        }
                    });
                this.sharedService.fetchBanks();
                this.listBanks$ = this.sharedService.getBanks();
                this.sharedService.fetchBanksBenefit();
                this.listBanksBenefit$ = this.sharedService.getBanksBenefit();
            }
        }
    }

    public initFormFundReloadMyAccount(): void {
        this.formFundMyAccount = this.fb.group<reloadMyAccountFormInterface>({
            code_banque_beneficiaire: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
            code_agence_beneficiaire: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
            reference: new FormControl<string>({ value: '', disabled: true }, { nonNullable: true }),
            montant: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
            date_remise: new FormControl<string>('', { validators: [Validators.required, dateNotInPastValidator], nonNullable: true }),

            mode_paiement: new FormControl<T_MODE_PAYMENT>(MODE_PAYMENT_ENUM.SPECIE, { nonNullable: true, validators: Validators.required }),
            contact_deposant: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.pattern("^[0-9]*$")] }),
            piece_jointe_bordereau: new FormControl<File | null>(null, { validators: Validators.required, nonNullable: true }),

            prenom_deposant: new FormControl<string>('', { nonNullable: true }),
            code_banque_tireur: new FormControl<string>('', { nonNullable: true }),
            numero_cheque: new FormControl<string>('', { nonNullable: true }),
            nom_tireur: new FormControl<string>('', { nonNullable: true }),
            nom_deposant: new FormControl<string>('', { nonNullable: true }),
        });

        this.formFundMyAccount.get('contact_deposant')?.valueChanges.subscribe(value => {
            if (value && value.length > 10) {
                this.formFundMyAccount.get('contact_deposant')?.setValue(value.slice(0, 10), { emitEvent: false });
            }
        });

        const codeBankBenefitControl = this.formFundMyAccount.get('code_banque_beneficiaire');
        codeBankBenefitControl?.valueChanges.subscribe((value: string) => {
            this.listAgencyBenefit$ = this.getListAgencies(value);
            this.updateReferenceFromBankBenefit(value);
        });
        const initialCodeBank = codeBankBenefitControl?.value as string;
        this.listAgencyBenefit$ = this.getListAgencies(initialCodeBank);
        // const gererValidationBankBenefit = (value: string) => {
        //     this.listAgencyBenefit$ = this.getListAgencies(value);
        // };
        // gererValidationBankBenefit(codeBankBenefitControl?.value as string);
        // codeBankBenefitControl?.valueChanges.subscribe((value: string) => {
        //     this.listAgencyBenefit$ = this.getListAgencies(value);
        // });
        this.updateReferenceFromBankBenefit(initialCodeBank);
        this.initMeansPaymentValidatorListeners();

        // const referenceControl = this.formFundMyAccount.get('reference');
        // const meansPaymentControl = this.formFundMyAccount.get("mode_paiement");
        // const codeBankControl = this.formFundMyAccount.get('code_banque_tireur');
        // const numberChequeControl = this.formFundMyAccount.get('numero_cheque');
        // const nameShooterControl = this.formFundMyAccount.get('nom_tireur');
        // const prenameDeposerControl = this.formFundMyAccount.get('prenom_deposant');
        // const nameDeposerControl = this.formFundMyAccount.get('nom_deposant');
        // const proofControl = this.formFundMyAccount.get('piece_jointe_bordereau');

        // const checkValidationMeansPayment = (value: T_MODE_PAYMENT) => {
        //     if (value === MODE_PAYMENT_ENUM.SPECIE) {
        //         codeBankControl?.clearValidators();
        //         numberChequeControl?.clearValidators();
        //         nameShooterControl?.clearValidators();
        //         prenameDeposerControl?.setValidators(Validators.required);
        //         nameDeposerControl?.setValidators(Validators.required);
        //         proofControl?.reset();
        //     } else {
        //         codeBankControl?.setValidators(Validators.required);
        //         numberChequeControl?.setValidators(Validators.required);
        //         nameShooterControl?.setValidators(Validators.required);
        //         prenameDeposerControl?.clearValidators();
        //         nameDeposerControl?.clearValidators();
        //         proofControl?.reset();
        //     }
        //     codeBankControl?.updateValueAndValidity();
        //     numberChequeControl?.updateValueAndValidity();
        //     nameShooterControl?.updateValueAndValidity();
        //     prenameDeposerControl?.updateValueAndValidity();
        //     nameDeposerControl?.updateValueAndValidity();
        //     proofControl?.updateValueAndValidity();
        // };
        // checkValidationMeansPayment(meansPaymentControl?.value as T_MODE_PAYMENT);
        // meansPaymentControl?.valueChanges.subscribe((value) => {
        //     checkValidationMeansPayment(value);
        // });

        // const checkValidationCodeBankBenefit = (value: string) => {
        //     if (value) {
        //         this.sharedService.getBanksBenefit().subscribe((listBanksBenefit) => {
        //             listBanksBenefit.map((banksBenefit: BankBenefitInterface) => {
        //                 if (banksBenefit.code === value) referenceControl?.setValue(banksBenefit.rib);
        //             })
        //         })
        //     } else {
        //         referenceControl?.reset();
        //     }
        //     referenceControl?.updateValueAndValidity();
        // };
        // checkValidationCodeBankBenefit(codeBankBenefitControl?.value as string);
        // codeBankBenefitControl?.valueChanges.subscribe((value: string) => {
        //     checkValidationCodeBankBenefit(value);
        // });
    }
    private initMeansPaymentValidatorListeners(): void {
        const modeControl = this.formFundMyAccount.get('mode_paiement');
        const chequeFields = [
            this.formFundMyAccount.get('code_banque_tireur'),
            this.formFundMyAccount.get('numero_cheque'),
            this.formFundMyAccount.get('nom_tireur')
        ];
        const cashFields = [
            this.formFundMyAccount.get('prenom_deposant'),
            this.formFundMyAccount.get('nom_deposant')
        ];
        const proofControl = this.formFundMyAccount.get('piece_jointe_bordereau');

        const applyValidators = (mode: T_MODE_PAYMENT) => {
            const isCash = mode === MODE_PAYMENT_ENUM.SPECIE;

            chequeFields.forEach(ctrl => isCash ? ctrl?.clearValidators() : ctrl?.setValidators(Validators.required));
            cashFields.forEach(ctrl => isCash ? ctrl?.setValidators(Validators.required) : ctrl?.clearValidators());

            proofControl?.reset();

            [...chequeFields, ...cashFields, proofControl].forEach(ctrl => ctrl?.updateValueAndValidity());
        };

        applyValidators(modeControl?.value as T_MODE_PAYMENT);
        modeControl?.valueChanges.subscribe(applyValidators);
    }
    private updateReferenceFromBankBenefit(code: string): void {
        const referenceControl = this.formFundMyAccount.get('reference');

        if (!code) {
            referenceControl?.reset();
            referenceControl?.updateValueAndValidity();
            return;
        }

        this.sharedService.getBanksBenefit().subscribe((list) => {
            const match = list.find(b => b.code === code);
            if (match) {
                referenceControl?.setValue(match.rib);
                referenceControl?.updateValueAndValidity();
            }
        });
    }

    public patchValueFormFundReloadMyAccount(transactionDetails$: Observable<ReloadAccountOperationDetailsInterface>): void {
        transactionDetails$
            .pipe(takeUntil(this.destroy$))
            .subscribe((details: any) => {
                if (!details || !this.formFundMyAccount) return;
                console.log('details', details)

                // Conserve l’URL ou le nom du fichier
                this.filePreviewUrl = details.piece_jointe_bordereau || null;

                const {
                    piece_jointe_bordereau, // ne le patche pas directement
                    ...formSafeData
                } = details;

                this.formFundMyAccount.patchValue(formSafeData);
            });
    }
    private getListAgencies(value: string): Observable<Array<AgencyBenefitInterface>> {
        return this.sharedService.getBanksBenefit().pipe(
            map((listBanksBenefit: Array<BankBenefitInterface>) => {
                const BanksBenefit = listBanksBenefit.find(fl => fl.code === value);
                return BanksBenefit ? BanksBenefit.agences : [];
            })
        );
    }
    public onChangeFile(file: FileList) {
        const selectedFile = file.item(0);
        this.formFundMyAccount.patchValue({ piece_jointe_bordereau: selectedFile });
    }

    async handleFundReloadMyAccount(): Promise<void> {
        if (this.formFundMyAccount.invalid) return;
        const SOMETHING_WENT_WRONG = this.translate.instant('SOMETHING_WENT_WRONG');
        const CONFIRM_THE_TRANSACTION_BY = this.translate.instant('CONFIRM_THE_TRANSACTION_BY');
        const mode_paiement = this.formFundMyAccount.get('mode_paiement')?.value;
        if (this.formFundMyAccount.valid) {
            const result = await Swal.mixin({ customClass: SWALWITHBOOTSTRAPBUTTONSPARAMS.customClass }).fire({ ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message, html: `<span><strong>${CONFIRM_THE_TRANSACTION_BY}</strong></span><span style="color: #569C5B; font-weight: bold; text-transform: uppercase"> ${mode_paiement}</span>` })
            if (result.isConfirmed) {
                const date_debut = this.formFundMyAccount.get("date_remise")?.value;
                const format_date = moment(date_debut).format('YYYY-MM-DD')
                const response: any = await handle(() => this.reloadMyAccountApiService.creditReloadMyAccount(formDataBuilder({ ...this.formFundMyAccount.value, date_remise: format_date })), this.toastrService, this.loadingBarService);
                if (response.error === false) {
                    this.reloadMyAccountApiService.fetchReloadMyAccount({} as reloadMyAccountFilterInterface);
                    this.closeInterface();
                }
            }
        } else {
            this.toastrService.error(SOMETHING_WENT_WRONG);
        }
    }

    public closeInterface(): void {
        this.router.navigate([ACCOUNTING + "/" + MY_RELOADS]);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}