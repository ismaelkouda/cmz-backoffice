/* import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UserFacade } from '@presentation/pages/settings-security/application/user.facade';
import { UserFilter } from '@presentation/pages/settings-security/domain/value-objects/user-filter.vo';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { AccessLogsFilterFormPayloadEntity } from '../../../domain/entities/access-logs/access-logs-filter-form-payload.entity';
import { AccessLogsFilterPayloadEntity } from '../../../domain/entities/access-logs/access-logs-filter-payload.entity';

@Component({
    selector: 'app-filter-access-logs',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DatePickerModule,
        SelectModule,
        ButtonModule,
    ],
    templateUrl: './filter-access-logs.component.html',
    styleUrls: ['./filter-access-logs.component.scss'],
})
export class FilterAccessLogsComponent implements OnInit {
    private readonly toastService = inject(ToastrService);
    private readonly userFacade = inject(UserFacade);
    private readonly fb = inject(FormBuilder);
    private readonly translate = inject(TranslateService);
    @Output() filterChange = new EventEmitter<AccessLogsFilterPayloadEntity>();
    public users$ = this.userFacade.users$;
    filterForm: FormGroup<AccessLogsFilterFormPayloadEntity>;

    constructor() {
        this.filterForm = this.fb.group<AccessLogsFilterFormPayloadEntity>({
            start_date: this.fb.control<string | null>(null),
            end_date: this.fb.control<string | null>(null),
            auth_user_id: this.fb.control<string | null>(null),
        });
    }

    ngOnInit(): void {
        this.userFacade.fetchUsers(UserFilter.create());
    }

    onSubmitFilterForm(): void {
        const createdFromControl = this.filterForm.get('start_date');
        const createdToControl = this.filterForm.get('end_date');

        const createdFromValue = createdFromControl?.value ?? '';
        const createdToValue = createdToControl?.value ?? '';

        const startDate = moment(createdFromValue, moment.ISO_8601, true);
        const endDate = moment(createdToValue, moment.ISO_8601, true);

        if (startDate.isValid() && endDate.isValid()) {
            if (startDate.isAfter(endDate)) {
                const invalidDateRange =
                    this.translate.instant('COMMON.INVALID_DATE_RANGE');
                this.toastService.error(invalidDateRange);
                return;
            }
        }

        const filterData: AccessLogsFilterPayloadEntity = {
            auth_user_id: this.filterForm.get('auth_user_id')?.value ?? '',
            start_date: startDate.isValid()
                ? startDate.format('YYYY-MM-DD')
                : '',
            end_date: endDate.isValid()
                ? endDate.format('YYYY-MM-DD')
                : '',
        };

        if (this.filterForm.valid) {
            this.filterChange.emit(filterData);
        } else {
            const translatedMessage = this.translate.instant('COMMON.FORM_INVALID');
            this.toastService.error(translatedMessage);
        }
    }
}
 */
