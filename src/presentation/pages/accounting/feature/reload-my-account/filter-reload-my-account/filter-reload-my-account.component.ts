import { Component, Input, EventEmitter, Output, OnDestroy } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import * as moment from 'moment';
import { ToastrService } from "ngx-toastr";
import { Subject, takeUntil } from 'rxjs';
import { reloadMyAccountFilterInterface } from '../../../data-access/reload-my-account/interfaces/reload-my-account-filter.interface';
import { TranslateService } from '@ngx-translate/core';
import { ReloadMyAccountApiService } from '../../../data-access/reload-my-account/service/reload-my-account-api.service';

@Component({
    selector: `app-filter-reload-my-account`,
    templateUrl: `./filter-reload-my-account.component.html`,
    styles: [`:host ::ng-deep { .p-calendar { position: relative; display: inline-flex; max-width: 100%; width: 21rem !important; } }, .col-md-2 { padding-right: 0 !important; }`]
})

export class FilterReloadMyAccountComponent implements OnDestroy {

    @Output() filter = new EventEmitter<reloadMyAccountFilterInterface>();

    public formFilter: FormGroup;
    private destroy$ = new Subject<void>();

    constructor(private toastService: ToastrService, private fb: FormBuilder,
        private translate: TranslateService, private reloadMyAccountApiService: ReloadMyAccountApiService) {
        this.initFormFilter();
    }

    public initFormFilter(): void {
        this.reloadMyAccountApiService.getDataFilterReloadMyAccount().pipe(takeUntil(this.destroy$)).subscribe((filterData) => {
            this.formFilter = this.fb.group<reloadMyAccountFilterInterface>({
                date_debut: new FormControl<string>(filterData?.["date_debut"], { nonNullable: true }),
                date_fin: new FormControl<string>(filterData?.["date_fin"], { nonNullable: true }),
                reference: new FormControl<string>(filterData?.["reference"], { nonNullable: true }),
                transaction: new FormControl<string>(filterData?.["transaction"], { nonNullable: true })
            });
        });
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}