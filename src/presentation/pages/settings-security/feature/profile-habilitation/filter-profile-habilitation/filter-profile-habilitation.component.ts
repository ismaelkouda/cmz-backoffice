/* import {
    Component,
    EventEmitter,
    inject,
    OnInit,
    Output
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserFacade } from '@presentation/pages/settings-security/application/user.facade';
import { ProfileHabilitationFilterFormPayloadEntity } from '@presentation/pages/settings-security/domain/entities/profile-habilitation/profile-habilitation-filter-form-payload.entity';
import { ProfileHabilitationFilterPayloadEntity } from '@presentation/pages/settings-security/domain/entities/profile-habilitation/profile-habilitation-filter-payload.entity';
import { UserFilter } from '@presentation/pages/settings-security/domain/value-objects/user-filter.vo';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'app-filter-profile-habilitation',
    standalone: true,
    templateUrl: './filter-profile-habilitation.component.html',
    styleUrls: ['./filter-profile-habilitation.component.scss'],
    imports: [
        ReactiveFormsModule,
        TranslateModule,
        SelectModule,
        InputTextModule,
        ButtonModule,
        RippleModule,
    ],
})
export class FilterProfileHabilitationComponent implements OnInit {
    private readonly toastService = inject(ToastrService);
    private readonly userFacade = inject(UserFacade);
    private readonly fb = inject(FormBuilder);
    private readonly translate = inject(TranslateService);
    @Output() filterChange = new EventEmitter<ProfileHabilitationFilterPayloadEntity>();
    public users$ = this.userFacade.users$;
    filterForm: FormGroup<ProfileHabilitationFilterFormPayloadEntity>;

    public readonly profileOptions = [
        {
            value: 'admin',
            label: 'SETTINGS_SECURITY.PROFILE_HABILITATION.OPTIONS.PROFILE.ADMIN',
        },
        {
            value: 'user',
            label: 'SETTINGS_SECURITY.PROFILE_HABILITATION.OPTIONS.PROFILE.USER',
        },
    ] as const;

    public readonly stateOptions = [
        {
            value: 'active',
            label: 'SETTINGS_SECURITY.PROFILE_HABILITATION.LABELS.STATUS.ACTIVE',
        },
        {
            value: 'inactive',
            label: 'SETTINGS_SECURITY.PROFILE_HABILITATION.LABELS.STATUS.INACTIVE',
        },
    ] as const;

    constructor() {
        this.filterForm = this.fb.group<ProfileHabilitationFilterFormPayloadEntity>({
            auth_user_id: this.fb.control<string | null>(null)
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

        const filterData: ProfileHabilitationFilterPayloadEntity = {
            auth_user_id: this.filterForm.get('auth_user_id')?.value ?? '',
        };

        if (this.filterForm.valid) {
            this.filterChange.emit(filterData);
        } else {
            const translatedMessage = this.translate.instant('COMMON.FORM_INVALID');
            this.toastService.error(translatedMessage);
        }
    }
} */
