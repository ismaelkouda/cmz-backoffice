import { claimsFormInterface } from './../../../data-access/claims/interfaces/claims-form.interface';
import { Component } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { filter, firstValueFrom, Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
const Swal = require('sweetalert2');
import { SWALWITHBOOTSTRAPBUTTONSPARAMS } from '../../../../../../shared/constants/swalWithBootstrapButtonsParams.constant';
import { OVERSEEING_OPERATIONS } from '../../../../../../shared/routes/routes';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '../../../../../../shared/services/shared.service';
import { BankInterface } from '../../../../../../shared/interfaces/bank.interface';
import { formDataBuilder } from '../../../../../../shared/constants/formDataBuilder.constant';
import { claimsFilterInterface } from '../../../data-access/claims/interfaces/claims-filter.interface';
import * as moment from 'moment';
import { dateNotInPastValidator } from '../../../../../../shared/functions/control-date.function';
import { CLAIMS } from '../../../overseeing-operations-routing.module';
import { ClaimsApiService } from '../../../data-access/claims/services/claims-api.service';

type TYPEVIEW = 'add-claims';
const TYPEVIEW_VALUES: TYPEVIEW[] = ['add-claims'];
function isTypeView(value: any): value is TYPEVIEW {
    return TYPEVIEW_VALUES.includes(value);
}

@Component({
    selector: 'app-form-claims',
    templateUrl: './form-claims.component.html',
    styleUrls: ['./form-claims.component.scss'],
})
export class FormClaimsComponent {
    public module: string;
    public subModule: string;
    public urlParamRef: TYPEVIEW;
    public urlParamTransaction: string;
    public displayUrlErrorPage: boolean = false;
    public formClaim: FormGroup<claimsFormInterface>;
    public listBanks$: Observable<Array<BankInterface>>;
    private destroy$ = new Subject<void>();

    constructor(
        private activatedRoute: ActivatedRoute,
        private toastService: ToastrService,
        private fb: FormBuilder,
        private translate: TranslateService,
        private router: Router,
        private claimsApiService: ClaimsApiService,
        private sharedService: SharedService
    ) {}

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[2];
        });
        this.activatedRoute.queryParams.subscribe((params: Object) => {
            this.urlParamRef = params?.['ref'];
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
            this.initFormFundClaims();
        }
    }

    public initFormFundClaims(): void {
        this.formClaim = this.fb.group<claimsFormInterface>({
            motifs: new FormControl<string>(
                { value: '', disabled: true },
                { nonNullable: true }
            ),
            date_remise: new FormControl<string>('', {
                validators: [Validators.required, dateNotInPastValidator],
                nonNullable: true,
            }),
            piece_jointe_bordereau: new FormControl<File | null>(null, {
                validators: Validators.required,
                nonNullable: true,
            }),
        });
    }

    public onChangeFile(file: FileList) {
        const selectedFile = file.item(0);
        this.formClaim.patchValue({
            piece_jointe_bordereau: selectedFile,
        });
    }

    async handleSubmitFormClaims(): Promise<void> {
        if (this.formClaim.invalid) return;
        const SOMETHING_WENT_WRONG = this.translate.instant(
            'SOMETHING_WENT_WRONG'
        );
        const CONFIRM_THE_TRANSACTION_BY = this.translate.instant(
            'CONFIRM_THE_TRANSACTION_BY'
        );
        if (this.formClaim.valid) {
            const result: any = await Swal.mixin({
                customClass: SWALWITHBOOTSTRAPBUTTONSPARAMS.customClass,
            }).fire({
                ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message,
                html: `<span><strong>${CONFIRM_THE_TRANSACTION_BY}</strong></span><span style="color: #569C5B; font-weight: bold; text-transform: uppercase"> </span>`,
            });
            if (result.isConfirmed) {
                const date_debut = this.formClaim.get('date_remise')?.value;
                const format_date_remise =
                    moment(date_debut).format('YYYY-MM-DD');
                this.claimsApiService.fetchCreateClaim(
                    formDataBuilder({
                        ...this.formClaim.value,
                        date_remise: format_date_remise,
                    })
                );
                const response = await firstValueFrom(
                    this.claimsApiService
                        .getCreateClaim()
                        .pipe(
                            filter(
                                (res) => !!res && Object.keys(res).length > 0
                            )
                        )
                );
                if (response && response['error'] === false) {
                    this.claimsApiService.fetchClaims(
                        {} as claimsFilterInterface
                    );
                    this.closeInterface();
                }
            }
        } else {
            this.toastService.error(SOMETHING_WENT_WRONG);
        }
    }

    public closeInterface(): void {
        this.router.navigate([OVERSEEING_OPERATIONS + '/' + CLAIMS]);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
