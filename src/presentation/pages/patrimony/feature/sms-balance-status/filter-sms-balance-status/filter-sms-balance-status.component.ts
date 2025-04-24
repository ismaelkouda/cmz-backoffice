import { SecondLevelService } from '../../../../../../shared/services/second-level.service';
import {
    Component,
    Input,
    EventEmitter,
    Output,
    OnDestroy,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FormulasInterface } from '../../../../../../shared/interfaces/formulas.interface';
import {
    FirstLevelInterface,
    SecondLevelInterface,
} from '../../../../../../shared/interfaces/first-level.interface';
import { ThirdLevelInterface } from '../../../../../../shared/interfaces/third-level.interface';
import { UsageInterface } from '../../../../../../shared/interfaces/usage.interface';
import { ApnInterface } from '../../../../../../shared/interfaces/apn.interface';
import { TypeAlarme } from '../../../../../../shared/enum/TypeAlarme.enum';
import { smsBalanceStatusFilterInterface } from '../../../data-access/sms-balance-status/interfaces/sms-balance-status-filter.interface';
import { TranslateService } from '@ngx-translate/core';
import { StoreCurrentUserService } from '../../../../../../shared/services/store-current-user.service';
import { smsBalanceStatusApiService } from '../../../data-access/sms-balance-status/services/sms-balance-status-api.service';

@Component({
    selector: `app-filter-sms-balance-status`,
    templateUrl: `./filter-sms-balance-status.component.html`,
    styleUrls: ['./filter-sms-balance-status.component.scss'],
})
export class FilterSmsBalanceStatusComponent implements OnDestroy {
    @Input() listFormulas$: Observable<Array<FormulasInterface>>;
    @Input() listFirstLevel$: Observable<Array<FirstLevelInterface>>;
    @Input() listThirdLevel$: Observable<Array<ThirdLevelInterface>>;
    @Input() listUsages$: Observable<Array<UsageInterface>>;
    @Input() listApn$: Observable<Array<ApnInterface>>;
    @Input() listAlarms: Array<TypeAlarme> = [];

    @Output() filter = new EventEmitter<smsBalanceStatusFilterInterface>();

    public listSecondLevel$: Observable<Array<SecondLevelInterface>>;
    public formFilter: FormGroup;

    public firstLevelLibel: string | undefined;
    public secondLevelLibel: string | undefined;
    public thirdLevelLibel: string | undefined;

    public secondFilter: boolean = false;

    private destroy$ = new Subject<void>();

    constructor(
        private toastService: ToastrService,
        private fb: FormBuilder,
        private storeCurrentUserService: StoreCurrentUserService,
        private translate: TranslateService,
        private secondLevelService: SecondLevelService,
        private smsBalanceStatusApiService: smsBalanceStatusApiService
    ) {
        this.initFormFilter();

        const currentUser = this.storeCurrentUserService.getCurrentUser;
        this.firstLevelLibel =
            currentUser?.structure_organisationnelle?.niveau_1;
        this.secondLevelLibel =
            currentUser?.structure_organisationnelle?.niveau_2;
        this.thirdLevelLibel =
            currentUser?.structure_organisationnelle?.niveau_3;
    }

    public initFormFilter(): void {
        this.smsBalanceStatusApiService
            .getDataFilterSmsBalanceStatus()
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData: smsBalanceStatusFilterInterface) => {
                this.expandedSecondLine(filterData);
                this.formFilter =
                    this.fb.group<smsBalanceStatusFilterInterface>({
                        imsi: new FormControl<string>(filterData?.['imsi'], {
                            nonNullable: true,
                            validators: [
                                Validators.pattern('^[0-9]*$'),
                                Validators.maxLength(15),
                                Validators.minLength(15),
                            ],
                        }),
                        iccid: new FormControl<string>(filterData?.['iccid'], {
                            nonNullable: true,
                        }),
                        statut: new FormControl<string>(
                            filterData?.['statut'],
                            { nonNullable: true }
                        ),
                        date_debut: new FormControl<string>(
                            filterData?.['date_debut'],
                            { nonNullable: true }
                        ),
                        date_fin: new FormControl<string>(
                            filterData?.['date_fin'],
                            { nonNullable: true }
                        ),
                        alarme: new FormControl<string>(
                            filterData?.['alarme'],
                            { nonNullable: true }
                        ),
                        niveau_un_uuid: new FormControl<string>(
                            filterData?.['niveau_un_uuid'],
                            { nonNullable: true }
                        ),
                        niveau_deux_uuid: new FormControl<string>(
                            filterData?.['niveau_deux_uuid'],
                            { nonNullable: true }
                        ),
                        msisdn: new FormControl<string>(
                            filterData?.['msisdn'],
                            { nonNullable: true }
                        ),
                        apn: new FormControl<string>(filterData?.['apn'], {
                            nonNullable: true,
                        }),
                        adresse_ip: new FormControl<string>(
                            filterData?.['adresse_ip'],
                            { nonNullable: true }
                        ),
                        usage_id: new FormControl<string>(
                            filterData?.['usage_id'],
                            { nonNullable: true }
                        ),
                        formule_uuid: new FormControl<string>(
                            filterData?.['formule_uuid'],
                            { nonNullable: true }
                        ),
                        niveau_trois_uuid: new FormControl<string>(
                            filterData?.['niveau_trois_uuid'],
                            { nonNullable: true }
                        ),
                        point_emplacement: new FormControl<string>(
                            filterData?.['point_emplacement'],
                            { nonNullable: true }
                        ),
                        zone_trafic: new FormControl<string>(
                            filterData?.['zone_trafic'],
                            { nonNullable: true }
                        ),
                    });

                this.formFilter.get('imsi')?.valueChanges.subscribe((value) => {
                    if (value && value.length > 15) {
                        this.formFilter
                            .get('imsi')
                            ?.setValue(value.slice(0, 15), {
                                emitEvent: false,
                            });
                    }
                });

                this.formFilter
                    .get('msisdn')
                    ?.valueChanges.subscribe((value) => {
                        if (value && value.length > 10) {
                            this.formFilter
                                .get('msisdn')
                                ?.setValue(value.slice(0, 10), {
                                    emitEvent: false,
                                });
                        }
                    });
                const firstLevelControl = this.formFilter.get('niveau_un_uuid');
                const gererValidatioFirstLevel = (value: string) => {
                    this.listSecondLevel$ =
                        this.secondLevelService.getSecondLevel(
                            value,
                            this.listFirstLevel$
                        );
                };
                gererValidatioFirstLevel(firstLevelControl?.value as string);
                firstLevelControl?.valueChanges.subscribe((value: string) => {
                    this.listSecondLevel$ =
                        this.secondLevelService.getSecondLevel(
                            value,
                            this.listFirstLevel$
                        );
                });
            });
    }

    public showSecondFilter(): void {
        this.secondFilter = !this.secondFilter;
    }

    public onSubmitFilterForm(): void {
        const date_debut = moment(
            this.formFilter.get('date_debut')?.value
        ).isValid()
            ? this.formFilter.get('date_debut')?.value
            : null;
        const date_fin = moment(
            this.formFilter.get('date_fin')?.value
        ).isValid()
            ? this.formFilter.get('date_fin')?.value
            : null;

        if (
            date_debut &&
            date_fin &&
            moment(date_debut).isAfter(moment(date_fin))
        ) {
            const INVALID_DATE_RANGE =
                this.translate.instant('INVALID_DATE_RANGE');
            this.toastService.error(INVALID_DATE_RANGE);
            return;
        }

        const filterData = {
            ...this.formFilter.value,
            date_debut: date_debut
                ? moment(date_debut).format('YYYY-MM-DD')
                : '',
            date_fin: date_fin ? moment(date_fin).format('YYYY-MM-DD') : '',
        };

        if (this.formFilter.valid) {
            this.filter.emit(filterData);
        } else {
            const translatedMessage = this.translate.instant('FORM_INVALID');
            this.toastService.success(translatedMessage);
        }
    }

    private expandedSecondLine(
        filterData: smsBalanceStatusFilterInterface
    ): void {
        if (
            filterData?.niveau_trois_uuid ||
            filterData?.formule_uuid ||
            filterData?.point_emplacement ||
            filterData?.zone_trafic ||
            filterData?.date_debut ||
            filterData?.date_fin
        ) {
            this.secondFilter = true;
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
