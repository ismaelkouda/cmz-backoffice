import { SecondLevelService } from '../../../../../../shared/services/second-level.service';
import { Component, Input, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import * as moment from 'moment';
import { ToastrService } from "ngx-toastr";
import { Observable } from 'rxjs';
import { FormulasInterface } from '../../../../../../shared/interfaces/formulas.interface';
import { FirstLevelInterface, SecondLevelInterface } from '../../../../../../shared/interfaces/first-level.interface';
import { ThirdLevelInterface } from '../../../../../../shared/interfaces/third-level.interface';
import { UsageInterface } from '../../../../../../shared/interfaces/usage.interface';
import { ApnInterface } from '../../../../../../shared/interfaces/apn.interface';
import { TypeAlarme } from '../../../../../../shared/enum/TypeAlarme.enum';
import { dataBalanceStatusFilterInterface } from '../../../data-access/data-balance-status/interfaces/data-balance-status-filter.interface';
import { TranslateService } from '@ngx-translate/core';
import { StoreCurrentUserService } from '../../../../../../shared/services/store-current-user.service';

@Component({
    selector: `app-filter-data-balance-status`,
    templateUrl: `./filter-data-balance-status.component.html`,
    styles: [`:host ::ng-deep { .p-calendar { position: relative; display: inline-flex; max-width: 100%; width: 21rem !important; } }, .col-md-2 { padding-right: 0 !important; }`]
})

export class FilterDataBalanceStatusComponent {

    @Input() listFormulas$: Observable<Array<FormulasInterface>>;
    @Input() listFirstLevel$: Observable<Array<FirstLevelInterface>>;
    @Input() listThirdLevel$: Observable<Array<ThirdLevelInterface>>;
    @Input() listUsages$: Observable<Array<UsageInterface>>;
    @Input() listApn$: Observable<Array<ApnInterface>>;
    @Input() listAlarms: Array<TypeAlarme> = [];
    @Input() filterData: dataBalanceStatusFilterInterface;
    
    @Output() filter = new EventEmitter<dataBalanceStatusFilterInterface>();

    public listSecondLevel$: Observable<Array<SecondLevelInterface>>;
    public formFilter: FormGroup;

    public firstLevelLibel: string|undefined;
    public secondLevelLibel: string|undefined;
    public thirdLevelLibel: string|undefined;

    public secondFilter: boolean = false;

    constructor(private toastService: ToastrService, private fb: FormBuilder,
        private storeCurrentUserService: StoreCurrentUserService, private translate: TranslateService,
        private secondLevelService: SecondLevelService) {
        this.initFormFilter();
        
        const currentUser = this.storeCurrentUserService.getCurrentUser;
        this.firstLevelLibel = currentUser?.structure_organisationnelle?.niveau_1;
        this.secondLevelLibel = currentUser?.structure_organisationnelle?.niveau_2;
        this.thirdLevelLibel = currentUser?.structure_organisationnelle?.niveau_3;
    }

    public initFormFilter(): void {
        this.formFilter = this.fb.group<dataBalanceStatusFilterInterface>({
            imsi: new FormControl<string>(this.filterData?.["imsi"], { nonNullable: true,
                validators: [Validators.pattern("^[0-9]*$"), Validators.maxLength(15), Validators.minLength(15)],
            }),
            iccid: new FormControl<string>(this.filterData?.["iccid"], { nonNullable: true }),
            statut: new FormControl<string>(this.filterData?.["statut"], { nonNullable: true }),
            date_debut: new FormControl<string>(this.filterData?.["date_debut"], { nonNullable: true }),
            date_fin: new FormControl<string>(this.filterData?.["date_fin"], { nonNullable: true }),
            alarme: new FormControl<string>(this.filterData?.["alarme"], { nonNullable: true }),
            niveau_un_uuid: new FormControl<string>(this.filterData?.["niveau_un_uuid"], { nonNullable: true }),
            niveau_deux_uuid: new FormControl<string>(this.filterData?.["niveau_deux_uuid"], { nonNullable: true }),
            msisdn: new FormControl<string>(this.filterData?.["msisdn"], { nonNullable: true }),
            apn: new FormControl<string>(this.filterData?.["apn"], { nonNullable: true }),
            adresse_ip: new FormControl<string>(this.filterData?.["adresse_ip"], { nonNullable: true }),
            usage_id: new FormControl<string>(this.filterData?.["usage_id"], { nonNullable: true }),
            formule_uuid: new FormControl<string>(this.filterData?.["formule_uuid"], { nonNullable: true }),
            niveau_trois_uuid: new FormControl<string>(this.filterData?.["niveau_trois_uuid"], { nonNullable: true }),
            point_emplacement: new FormControl<string>(this.filterData?.["point_emplacement"], { nonNullable: true }),
            zone_trafic: new FormControl<string>(this.filterData?.["zone_trafic"], { nonNullable: true }),
        });

        this.formFilter.get("imsi")?.valueChanges.subscribe((value) => {
            if (value && value.length > 15) {
                this.formFilter.get("imsi")?.setValue(value.slice(0, 15), { emitEvent: false });
            }
        });

        this.formFilter.get("msisdn")?.valueChanges.subscribe((value) => {
            if (value && value.length > 10) {
                this.formFilter.get("msisdn")?.setValue(value.slice(0, 10), { emitEvent: false });
            }
        });
        this.formFilter?.get('niveau_un_uuid')?.valueChanges.subscribe(
            this.fetchSecondLevel.bind(this)
        );
    }

    async fetchSecondLevel(uuid: string): Promise<void> {
        this.listSecondLevel$ = await this.secondLevelService.getSecondLevel(uuid);
    }

    public showSecondFilter(): void {
        this.secondFilter = !this.secondFilter;
    }

    public onSubmitFilterForm(): void {
        const date_debut = moment(this.formFilter.get("date_debut")?.value).isValid()
            ? this.formFilter.get("date_debut")?.value : null;
        const date_fin = moment(this.formFilter.get("date_fin")?.value).isValid()
            ? this.formFilter.get("date_fin")?.value : null;

        if (date_debut && date_fin && moment(date_debut).isAfter(moment(date_fin))) {
            const INVALID_DATE_RANGE = this.translate.instant('INVALID_DATE_RANGE');
            this.toastService.error(INVALID_DATE_RANGE);
            return;
        }

        const filterData = {
            ...this.formFilter.value,
            date_debut: date_debut ? moment(date_debut).format('YYYY-MM-DD') : '',
            date_fin: date_fin ? moment(date_fin).format('YYYY-MM-DD') : ''
        };

        if (this.formFilter.valid) {
            this.filter.emit(filterData);
        } else {
            const translatedMessage = this.translate.instant('FORM_INVALID');
            this.toastService.success(translatedMessage);
        }
    }
}