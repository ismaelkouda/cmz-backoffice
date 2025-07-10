import { UsageInterface } from './../../../../../../shared/interfaces/usage.interface';
import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { simCardFilterInterface } from './../../../data-access/sim-card/interfaces/sim-card-filter.interface';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
    FirstLevelInterface,
    SecondLevelInterface,
} from '@shared/interfaces/first-level.interface';
import { T_SIM_CARD_STATUS_ENUM } from '../../../data-access/sim-card/enums/sim-card-status.enum';
import { simCardApiService } from '../../../data-access/sim-card/services/sim-card-api.service';
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
import { SecondLevelService } from '../../../../../../shared/services/second-level.service';
import { FormulasInterface } from '../../../../../../shared/interfaces/formulas.interface';
import { ThirdLevelInterface } from '../../../../../../shared/interfaces/third-level.interface';
import { ApnInterface } from '../../../../../../shared/interfaces/apn.interface';
import { T_SIM_CARD_IDENTIFICATION_ENUM } from '../../../data-access/sim-card/enums/sim-card-identification.enum';
import { EncodingDataService } from '../../../../../../shared/services/encoding-data.service';
import { CurrentUser } from '../../../../../../shared/interfaces/current-user.interface';

@Component({
    selector: 'app-filter-sim-card',
    templateUrl: './filter-sim-card.component.html',
    animations: [
        trigger('slideInOut', [
            state(
                'void',
                style({
                    transform: 'translateY(-20px)',
                    opacity: 0,
                })
            ),
            transition(':enter', [
                animate(
                    '300ms ease-in',
                    style({
                        transform: 'translateY(0)',
                        opacity: 1,
                    })
                ),
            ]),
            transition(':leave', [
                animate(
                    '300ms ease-out',
                    style({
                        transform: 'translateY(-20px)',
                        opacity: 0,
                    })
                ),
            ]),
        ]),
    ],
    styleUrls: ['./filter-sim-card.component.scss'],
})
export class FilterSimCardComponent implements OnInit, OnDestroy {
    @Input() listFormulas$: Observable<Array<FormulasInterface>>;
    @Input() listFirstLevel$: Observable<Array<FirstLevelInterface>>;
    @Input() listThirdLevel$: Observable<Array<ThirdLevelInterface>>;
    @Input() listUsages$: Observable<Array<UsageInterface>>;
    @Input() listApn$: Observable<Array<ApnInterface>>;
    @Input() listStatusSimCard: Array<T_SIM_CARD_STATUS_ENUM>;
    @Input() listStatusIdentification: Array<T_SIM_CARD_IDENTIFICATION_ENUM>;

    @Output() filter = new EventEmitter<simCardFilterInterface | {}>();

    public listSecondLevel$: Observable<Array<SecondLevelInterface>>;
    public formFilter: FormGroup<simCardFilterInterface>;
    private destroy$ = new Subject<void>();
    private destroyUserData$ = new Subject<void>();

    public firstLevelLibel: string | undefined;
    public secondLevelLibel: string | undefined;
    public thirdLevelLibel: string | undefined;

    public secondFilter: boolean = false;
    public thirdFilter: boolean = false;

    constructor(
        private fb: FormBuilder,
        private toastService: ToastrService,
        private encodingService: EncodingDataService,
        private translate: TranslateService,
        private secondLevelService: SecondLevelService,
        private simCardApiService: simCardApiService
    ) {}

    ngOnInit() {
        this.initFormFilter();
        const user = this.encodingService.getData(
            'user_data'
        ) as CurrentUser | null;
        this.firstLevelLibel = user?.structure_organisationnelle?.niveau_1;
        this.secondLevelLibel = user?.structure_organisationnelle?.niveau_2;
        this.thirdLevelLibel = user?.structure_organisationnelle?.niveau_3;
    }

    public showSecondFilter() {
        this.secondFilter = !this.secondFilter;
        this.thirdFilter = false;
    }

    public showThirdFilter() {
        this.thirdFilter = !this.thirdFilter;
    }

    public initFormFilter(): void {
        this.simCardApiService
            .getDataFilterSimCard()
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData: simCardFilterInterface) => {
                this.expandedFirstLine(filterData);
                this.formFilter = this.fb.group<simCardFilterInterface>({
                    imsi: new FormControl<string>(filterData?.['imsi'], {
                        nonNullable: true,
                        validators: [
                            Validators.pattern('^[0-9]*$'),
                            Validators.maxLength(15),
                            Validators.minLength(15),
                        ],
                    }),
                    statut: new FormControl<string>(filterData?.['statut'], {
                        nonNullable: true,
                    }),
                    identification_fiabilite: new FormControl<string>(
                        filterData?.['identification_fiabilite'],
                        {
                            nonNullable: true,
                        }
                    ),
                    date_debut: new FormControl<string>(
                        filterData?.['date_debut'],
                        { nonNullable: true }
                    ),
                    date_fin: new FormControl<string>(
                        filterData?.['date_fin'],
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
                    msisdn: new FormControl<string>(filterData?.['msisdn'], {
                        nonNullable: true,
                    }),
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

    private expandedFirstLine(filterData: simCardFilterInterface): void {
        if (
            filterData?.imsi ||
            filterData?.formule_uuid ||
            filterData?.apn ||
            filterData?.adresse_ip ||
            filterData?.usage_id
        ) {
            this.secondFilter = true;
        } else if (
            filterData?.date_fin ||
            filterData?.date_debut ||
            filterData?.zone_trafic ||
            filterData?.point_emplacement ||
            filterData?.niveau_trois_uuid
        ) {
            this.secondFilter = true;
            this.thirdFilter = true;
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.destroyUserData$.next();
        this.destroyUserData$.complete();
    }
}
