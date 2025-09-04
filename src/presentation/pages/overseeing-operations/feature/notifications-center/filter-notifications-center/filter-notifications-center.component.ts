import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { notificationsCenterFilterInterface } from '../../../data-access/notifications-center/interfaces/notifications-center-filter.interface';

@Component({
    selector: `app-filter-notifications-center`,
    templateUrl: `./filter-notifications-center.component.html`,
    styleUrls: ['./filter-notifications-center.component.scss'],
})
export class FilterNotificationsCenterComponent {
    @Input() listTypeNotifications: Array<any> = [];
    @Input() filterData: notificationsCenterFilterInterface;

    @Output() filter = new EventEmitter<notificationsCenterFilterInterface>();

    public formFilter: FormGroup;

    constructor(
        private toastService: ToastrService,
        private fb: FormBuilder,
        private translate: TranslateService
    ) {
        this.initFormFilter();
    }

    public initFormFilter(): void {
        this.formFilter = this.fb.group<notificationsCenterFilterInterface>({
            numero_demande: new FormControl<string>(
                this.filterData?.['numero_demande'],
                { nonNullable: true }
            ),
            notification: new FormControl<string>(
                this.filterData?.['notifications'],
                { nonNullable: true }
            ),
            date_debut: new FormControl<string>(
                this.filterData?.['date_debut'],
                { nonNullable: true }
            ),
            date_fin: new FormControl<string>(this.filterData?.['date_fin'], {
                nonNullable: true,
            }),
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
}
