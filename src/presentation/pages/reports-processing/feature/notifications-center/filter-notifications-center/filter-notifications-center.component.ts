/* import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { notificationsFilterEntity } from '../../../domain/entities/notifications-filter.entity';

@Component({
    selector: `app-filter-notifications-center`,
    standalone: true,
    templateUrl: `./filter-notifications-center.component.html`,
    styleUrls: ['./filter-notifications-center.component.scss'],
    imports: [
        ReactiveFormsModule,
        TranslateModule,
        SelectModule,
        InputTextModule,
        DatePickerModule,
        ButtonModule,
        RippleModule,
    ],
})
export class FilterNotificationsCenterComponent {
    @Input() listTypeNotifications: Array<any> = [];
    @Input() filterData!: notificationsFilterEntity;

    @Output() filter = new EventEmitter<notificationsFilterEntity>();

    public formFilter!: FormGroup;

    constructor(
        private toastService: ToastrService,
        private fb: FormBuilder,
        private translate: TranslateService
    ) {
        this.initFormFilter();
    }

    public initFormFilter(): void {
        this.formFilter = this.fb.group<notificationsFilterEntity>({
            numero_demande: new FormControl<string>(
                this.filterData?.['numero_demande'],
                { nonNullable: true }
            ),
            notification: new FormControl<string>(
                this.filterData?.['notification'],
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
 */
