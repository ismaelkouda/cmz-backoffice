import { MODE_PAYMENT_ENUM } from './../../../../../../shared/enum/mode-payment.enum';
import { Component } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MappingService } from '../../../../../../shared/services/mapping.service';
import {
    filter,
    firstValueFrom,
    map,
    Observable,
    Subject,
    takeUntil,
} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoadingBarService } from '@ngx-loading-bar/core';
const Swal = require('sweetalert2');
import { SWALWITHBOOTSTRAPBUTTONSPARAMS } from '../../../../../../shared/constants/swalWithBootstrapButtonsParams.constant';
import { handle } from '../../../../../../shared/functions/api.function';
import { ACCOUNTING } from '../../../../../../shared/routes/routes';
import { MY_RELOADS } from '../../../accounting-routing.module';
import { TranslateService } from '@ngx-translate/core';
import { reloadMyAccountFormInterface } from '../../../data-access/reload-my-account/interfaces/reload-my-account-form.interface';
import { ReloadMyAccountApiService } from '../../../data-access/reload-my-account/service/reload-my-account-api.service';
import { SharedService } from '../../../../../../shared/services/shared.service';
import { BankInterface } from '../../../../../../shared/interfaces/bank.interface';
import { formDataBuilder } from '../../../../../../shared/constants/formDataBuilder.constant';
import { reloadMyAccountFilterInterface } from '../../../data-access/reload-my-account/interfaces/reload-my-account-filter.interface';
import { T_MODE_PAYMENT } from '../../../data-access/reload-my-account/types/mode-payment.type';
import * as moment from 'moment';
import {
    AgencyBenefitInterface,
    BankBenefitInterface,
} from '../../../../../../shared/interfaces/bank-beneficiaire.interface';
import { dateNotInPastValidator } from '../../../../../../shared/functions/control-date.function';
import { ReloadAccountOperationDetailsInterface } from '../../../data-access/reload-my-account/interfaces/transaction-details.interface';
import {
    T_MY_RELOADS_STATUS_ENUM,
    MY_RELOADS_STATUS_ENUM,
} from '../../../data-access/reload-my-account/enums/reload-my-account-status.enum';

type TYPEVIEW =
    | 'reload-my-account'
    | 'details-reload-my-account'
    | 'edit-reload-my-account';
const TYPEVIEW_VALUES: TYPEVIEW[] = [
    'reload-my-account',
    'details-reload-my-account',
    'edit-reload-my-account',
];
function isTypeView(value: any): value is TYPEVIEW {
    return TYPEVIEW_VALUES.includes(value);
}

@Component({
    selector: 'app-form-reload-my-account',
    templateUrl: './form-reload-my-account.component.html',
    styleUrls: ['./form-reload-my-account.component.scss'],
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
    public transactionDetails$: Observable<ReloadAccountOperationDetailsInterface>;
    public filePreviewUrl: string | null = null;
    public isDetailsMode: boolean = false;
    public isEditMode: boolean = false;
    public isCreateMode: boolean = false;
    public visibleFilePreview: boolean = false;
    public MY_RELOADS_STATUS_ENUM = MY_RELOADS_STATUS_ENUM;
    private destroy$ = new Subject<void>();

    constructor(
        private activatedRoute: ActivatedRoute,
        private toastrService: ToastrService,
        private fb: FormBuilder,
        private translate: TranslateService,
        public mappingService: MappingService,
        private router: Router,
        private reloadMyAccountApiService: ReloadMyAccountApiService,
        private sharedService: SharedService
    ) {}

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[0];
        });
        this.activatedRoute.queryParams.subscribe((params: Object) => {
            this.urlParamRef = params?.['ref'];
            this.isDetailsMode =
                this.urlParamRef === 'details-reload-my-account';
            this.isEditMode = this.urlParamRef === 'edit-reload-my-account';
            this.isCreateMode = this.urlParamRef === 'reload-my-account';
            this.getParamsInUrl();
        });
    }

    private getParamsInUrl(): void {
        if (!isTypeView(this.urlParamRef)) {
            this.displayUrlErrorPage = true;
            return;
        } else {
            this.sharedService.fetchBanks();
            this.listBanks$ = this.sharedService.getBanks();
            this.sharedService.fetchBanksBenefit();
            this.listBanksBenefit$ = this.sharedService.getBanksBenefit();
            this.initFormFundReloadMyAccount();
            const isDetailsOrEdit = this.isDetailsMode || this.isEditMode;
            if (isDetailsOrEdit) {
                this.urlParamTransaction =
                    this.activatedRoute.snapshot.paramMap.get('transaction') ??
                    '';

                this.reloadMyAccountApiService.fetchTransactionDetails(
                    this.urlParamTransaction
                );
                this.transactionDetails$ =
                    this.reloadMyAccountApiService.getTransactionDetails();
                this.reloadMyAccountApiService
                    .isLoadingTransactionDetails()
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((isLoading: boolean) => {
                        if (isLoading) {
                            this.patchValueFormFundReloadMyAccount(
                                this.transactionDetails$
                            );
                        }
                    });
                this.isDetailsMode ? this.formFundMyAccount.disable() : '';
                this.isEditMode
                    ? this.formFundMyAccount
                          .get('piece_jointe_bordereau')
                          ?.clearValidators()
                    : '';
            }
        }
    }

    public initFormFundReloadMyAccount(): void {
        this.formFundMyAccount = this.fb.group<reloadMyAccountFormInterface>({
            code_banque_beneficiaire: new FormControl<string>('', {
                validators: Validators.required,
                nonNullable: true,
            }),
            code_agence_beneficiaire: new FormControl<string>('', {
                validators: Validators.required,
                nonNullable: true,
            }),
            reference: new FormControl<string>(
                { value: '', disabled: true },
                { nonNullable: true }
            ),
            montant: new FormControl<string>('', {
                nonNullable: true,
                validators: Validators.required,
            }),
            date_remise: new FormControl<string>('', {
                validators: [Validators.required, dateNotInPastValidator],
                nonNullable: true,
            }),

            mode_paiement: new FormControl<T_MODE_PAYMENT>(
                MODE_PAYMENT_ENUM.SPECIE,
                { nonNullable: true, validators: Validators.required }
            ),
            contact_deposant: new FormControl<string>('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.pattern('^[0-9]*$'),
                ],
            }),
            piece_jointe_bordereau: new FormControl<File | null>(null, {
                validators: Validators.required,
                nonNullable: true,
            }),

            prenom_deposant: new FormControl<string>('', { nonNullable: true }),
            code_banque_tireur: new FormControl<string>('', {
                nonNullable: true,
            }),
            numero_cheque: new FormControl<string>('', { nonNullable: true }),
            nom_tireur: new FormControl<string>('', { nonNullable: true }),
            nom_deposant: new FormControl<string>('', { nonNullable: true }),
        });

        this.formFundMyAccount
            .get('contact_deposant')
            ?.valueChanges.subscribe((value) => {
                if (value && value.length > 10) {
                    this.formFundMyAccount
                        .get('contact_deposant')
                        ?.setValue(value.slice(0, 10), { emitEvent: false });
                }
            });

        const codeBankBenefitControl = this.formFundMyAccount.get(
            'code_banque_beneficiaire'
        );
        const initialCodeBank = codeBankBenefitControl?.value as string;

        const gererValidationBankBenefit = (value: string) => {
            this.listAgencyBenefit$ = this.getListAgencies(initialCodeBank);
        };
        gererValidationBankBenefit(codeBankBenefitControl?.value as string);
        codeBankBenefitControl?.valueChanges.subscribe((value: string) => {
            this.updateReferenceFromBankBenefit(value);
            this.listAgencyBenefit$ = this.getListAgencies(value);
        });

        this.updateReferenceFromBankBenefit(initialCodeBank);
        this.initMeansPaymentValidatorListeners();
    }

    private initMeansPaymentValidatorListeners(): void {
        const modeControl = this.formFundMyAccount.get('mode_paiement');
        const chequeFields = [
            this.formFundMyAccount.get('code_banque_tireur'),
            this.formFundMyAccount.get('numero_cheque'),
            this.formFundMyAccount.get('nom_tireur'),
        ];
        const cashFields = [
            this.formFundMyAccount.get('prenom_deposant'),
            this.formFundMyAccount.get('nom_deposant'),
        ];
        const proofControl = this.formFundMyAccount.get(
            'piece_jointe_bordereau'
        );

        const applyValidators = (mode: T_MODE_PAYMENT) => {
            const isCash = mode === MODE_PAYMENT_ENUM.SPECIE;

            chequeFields.forEach((ctrl) =>
                isCash
                    ? ctrl?.clearValidators()
                    : ctrl?.setValidators(Validators.required)
            );
            cashFields.forEach((ctrl) =>
                isCash
                    ? ctrl?.setValidators(Validators.required)
                    : ctrl?.clearValidators()
            );

            proofControl?.reset();

            [...chequeFields, ...cashFields, proofControl].forEach((ctrl) =>
                ctrl?.updateValueAndValidity()
            );
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
            const match = list.find((b) => b.code === code);
            if (match) {
                referenceControl?.setValue(match.rib);
                referenceControl?.updateValueAndValidity();
            }
        });
    }

    public patchValueFormFundReloadMyAccount(
        transactionDetails$: Observable<ReloadAccountOperationDetailsInterface>
    ): void {
        transactionDetails$
            .pipe(takeUntil(this.destroy$))
            .subscribe((details: any) => {
                if (!details || !this.formFundMyAccount) return;

                this.filePreviewUrl = details.piece_jointe_bordereau || null;

                const montantFormat = details.montant
                    ? parseFloat(
                          details.montant
                              .toString()
                              .replace(/\s/g, '')
                              .replace(',', '.')
                      )
                    : null;

                const { piece_jointe_bordereau, ...formSafeData } = details;

                this.formFundMyAccount.patchValue({
                    ...formSafeData,
                    montant: montantFormat,
                });
            });
    }

    private getListAgencies(
        value: string
    ): Observable<Array<AgencyBenefitInterface>> {
        return this.sharedService.getBanksBenefit().pipe(
            map((listBanksBenefit: Array<BankBenefitInterface>) => {
                const BanksBenefit = listBanksBenefit.find(
                    (fl) => fl.code === value
                );
                return BanksBenefit ? BanksBenefit.agences : [];
            })
        );
    }

    public onChangeFile(file: FileList) {
        const selectedFile = file.item(0);
        this.formFundMyAccount.patchValue({
            piece_jointe_bordereau: selectedFile,
        });
    }

    async handleFundReloadMyAccount(): Promise<void> {
        if (this.formFundMyAccount.invalid) return;
        const SOMETHING_WENT_WRONG = this.translate.instant(
            'SOMETHING_WENT_WRONG'
        );
        const CONFIRM_THE_TRANSACTION_BY = this.translate.instant(
            'CONFIRM_THE_TRANSACTION_BY'
        );
        const mode_paiement =
            this.formFundMyAccount.get('mode_paiement')?.value;
        if (this.formFundMyAccount.valid) {
            const result = await Swal.mixin({
                customClass: SWALWITHBOOTSTRAPBUTTONSPARAMS.customClass,
            }).fire({
                ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message,
                html: `<span><strong>${CONFIRM_THE_TRANSACTION_BY}</strong></span><span style="color: #569C5B; font-weight: bold; text-transform: uppercase"> ${mode_paiement}</span>`,
            });
            if (result.isConfirmed) {
                const date_debut =
                    this.formFundMyAccount.get('date_remise')?.value;
                const format_date_remise =
                    moment(date_debut).format('YYYY-MM-DD');
                this.reloadMyAccountApiService.fetchDemandCredit(
                    formDataBuilder({
                        ...this.formFundMyAccount.value,
                        date_remise: format_date_remise,
                    })
                );
                const response = await firstValueFrom(
                    this.reloadMyAccountApiService
                        .getDemandCredit()
                        .pipe(
                            filter(
                                (res) => !!res && Object.keys(res).length > 0
                            )
                        )
                );
                if (response && response.error === false) {
                    this.reloadMyAccountApiService.fetchReloadMyAccount(
                        {} as reloadMyAccountFilterInterface
                    );
                    this.closeInterface();
                }
            }
        } else {
            this.toastrService.error(SOMETHING_WENT_WRONG);
        }
    }

    async handleUpdateReloadMyAccount(): Promise<void> {
        if (this.formFundMyAccount.invalid) return;
        const SOMETHING_WENT_WRONG = this.translate.instant(
            'SOMETHING_WENT_WRONG'
        );
        const CONFIRM_THE_TRANSACTION_BY = this.translate.instant(
            'CONFIRM_THE_TRANSACTION_BY'
        );
        const mode_paiement =
            this.formFundMyAccount.get('mode_paiement')?.value;
        if (this.formFundMyAccount.valid) {
            const result = await Swal.mixin({
                customClass: SWALWITHBOOTSTRAPBUTTONSPARAMS.customClass,
            }).fire({
                ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message,
                html: `<span><strong>${CONFIRM_THE_TRANSACTION_BY}</strong></span><span style="color: #569C5B; font-weight: bold; text-transform: uppercase"> ${mode_paiement}</span>`,
            });
            if (result.isConfirmed) {
                const date_debut =
                    this.formFundMyAccount.get('date_remise')?.value;
                const format_date_remise =
                    moment(date_debut).format('YYYY-MM-DD');
                this.reloadMyAccountApiService.fetchUpdateDemandCredit(
                    formDataBuilder({
                        ...this.formFundMyAccount.value,
                        date_remise: format_date_remise,
                        transaction: this.urlParamTransaction,
                    })
                );
                const response = await firstValueFrom(
                    this.reloadMyAccountApiService
                        .getUpdateDemandCredit()
                        .pipe(
                            filter(
                                (res) => !!res && Object.keys(res).length > 0
                            )
                        )
                );
                if (response.error === false) {
                    this.toastrService.success(response.message);
                    this.reloadMyAccountApiService.fetchReloadMyAccount(
                        {} as reloadMyAccountFilterInterface
                    );
                    this.closeInterface();
                    return;
                }
                this.toastrService.error(response.message);
            }
        } else {
            this.toastrService.error(SOMETHING_WENT_WRONG);
        }
    }

    public onLetDownReloadMyAccount() {
        const SOMETHING_WENT_WRONG = this.translate.instant(
            'SOMETHING_WENT_WRONG'
        );
        const YOU_ARE_ABOUT_TO_ABANDON_THE_TRANSACTION = this.translate.instant(
            'YOU_ARE_ABOUT_TO_ABANDON_THE_TRANSACTION'
        );
        const COMMENT = this.translate.instant('COMMENT');
        Swal.mixin({ ...SWALWITHBOOTSTRAPBUTTONSPARAMS.customClass })
            .fire({
                title: 'Êtes-vous sûr ?',
                html: `<h2 class="badge badge-success fs-4">${YOU_ARE_ABOUT_TO_ABANDON_THE_TRANSACTION} !</h2>`,
                input: 'text',
                inputPlaceholder: `Ex: ${COMMENT}...`,
                inputAttributes: { autocapitalize: 'off', autocomplete: 'off' },
                showCancelButton: true,
                cancelButtonText: 'Annuler        ',
                confirmButtonText: 'Confirmer',
                confirmButtonColor: '#569C5B',
                cancelButtonColor: '#dc3545',
                showLoaderOnConfirm: true,
                backdrop: false,
                width: 800,
                preConfirm: async (commentaire) => {
                    try {
                        this.reloadMyAccountApiService.fetchLetDownCredit({
                            transaction: this.urlParamTransaction,
                            commentaire: commentaire,
                        });
                        const response = await firstValueFrom(
                            this.reloadMyAccountApiService
                                .getUpdateDemandCredit()
                                .pipe(
                                    filter(
                                        (res) =>
                                            !!res && Object.keys(res).length > 0
                                    )
                                )
                        );
                        if (response.error === false) {
                            this.toastrService.success(response.message);
                            this.reloadMyAccountApiService.fetchReloadMyAccount(
                                {} as reloadMyAccountFilterInterface
                            );
                            this.closeInterface();
                            return;
                        }
                    } catch (error) {
                        const SOMETHING_WENT_WRONG = this.translate.instant(
                            'SOMETHING_WENT_WRONG'
                        );
                        Swal.showValidationMessage(`${SOMETHING_WENT_WRONG}`);
                    }
                },
                allowOutsideClick: () => !Swal.isLoading(),
            })
            .then((result) => {
                if (result.isConfirmed) {
                    Swal.showValidationMessage(`${SOMETHING_WENT_WRONG}`);
                }
            });
    }

    public showFilePreview() {
        this.visibleFilePreview = true;
    }

    public closeInterface(): void {
        this.router.navigate([ACCOUNTING + '/' + MY_RELOADS]);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
