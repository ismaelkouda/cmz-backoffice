/* import { Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserFacade } from '@presentation/pages/settings-security/application/user.facade';
import { UsersFilterFormPayloadEntity } from '@presentation/pages/settings-security/domain/entities/users/users-filter-form-payload.entity';
import { UsersFilterPayloadEntity } from '@presentation/pages/settings-security/domain/entities/users/users-filter-payload.entity';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-filter-user',
    standalone: true,
    templateUrl: './filter-user.component.html',
    styleUrls: ['./filter-user.component.scss'],
    imports: [
        ReactiveFormsModule,
        TranslateModule,
        SelectModule,
        InputTextModule,
        ButtonModule,
        RippleModule,
    ],
})
export class FilterUserComponent implements OnInit, OnDestroy {
    private readonly toastService = inject(ToastrService);
    private readonly fb = inject(FormBuilder);
    private readonly translate = inject(TranslateService);
    private readonly userFacade = inject(UserFacade);
    @Output() filter = new EventEmitter<UsersFilterPayloadEntity>();

    public formFilter!: FormGroup<UsersFilterFormPayloadEntity>;

    private readonly destroy$ = new Subject<void>();

    readonly profilOptions = [
        {
            value: 'admin',
            label: 'SETTINGS_SECURITY.USER.OPTIONS.PROFIL.ADMIN',
        },
        {
            value: 'user',
            label: 'SETTINGS_SECURITY.USER.OPTIONS.PROFIL.USER',
        },
    ] as const;

    readonly statusOptions = [
        {
            value: 'active',
            label: 'SETTINGS_SECURITY.USER.LABELS.STATUS.ACTIVE',
        },
        {
            value: 'inactive',
            label: 'SETTINGS_SECURITY.USER.LABELS.STATUS.INACTIVE',
        },
    ] as const;

    ngOnInit(): void {
        this.initFormFilter();
    }

    public initFormFilter(): void {
        if (!this.formFilter) {
            this.formFilter = this.fb.group<UsersFilterFormPayloadEntity>({
                userProfile: new FormControl<string>('', {
                    nonNullable: true,
                }),
                status: new FormControl<string>('', {
                    nonNullable: true,
                }),
                matricule: new FormControl<string>('', {
                    nonNullable: true,
                }),
                fullName: new FormControl<string>('', {
                    nonNullable: true,
                }),
            });
        }

        this.userFacade.currentFilter$
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterValue) => {
                if (!this.formFilter) return;

                const dto = typeof filterValue?.toDto === 'function'
                    ? filterValue.toDto() : {};

                this.formFilter.patchValue(
                    {
                        userProfile: dto['user_profile'] ?? '',
                        status: dto['state'] ?? '',
                        matricule: dto['matricule'] ?? '',
                        fullName: dto['search'] ?? '',
                    },
                    { emitEvent: false }
                );
            });
    }

    public resetSelect<K extends keyof UsersFilterFormPayloadEntity>(
        controlName: K
    ): void {
        const control = this.formFilter?.controls[controlName];
        if (control) {
            control.setValue('', { emitEvent: false });
        }
    }

    public onSubmitFilterForm(): void {
       const createdFromControl = this.formFilter.get('created_from');
        const createdToControl = this.formFilter.get('created_to');
 
        const createdFromValue = createdFromControl?.value ?? '';
        const createdToValue = createdToControl?.value ?? '';
 
        const createdFrom = moment(createdFromValue, moment.ISO_8601, true);
        const createdTo = moment(createdToValue, moment.ISO_8601, true);
 
        if (createdFrom.isValid() && createdTo.isValid()) {
            if (createdFrom.isAfter(createdTo)) {
                const INVALID_DATE_RANGE =
                    this.translate.instant('INVALID_DATE_RANGE');
                this.toastService.error(INVALID_DATE_RANGE);
                return;
            }
        }
 
        const filterData: UsersFilterPayloadEntity = {
            created_from: createdFrom.isValid()
                ? createdFrom.format('YYYY-MM-DD')
                : '',
            created_to: createdTo.isValid()
                ? createdTo.format('YYYY-MM-DD')
                : '',
            state: this.formFilter.get('state')?.value?.trim() ?? '',
            matricule: this.formFilter.get('matricule')?.value?.trim() ?? '',
            search: this.formFilter.get('search')?.value?.trim() ?? '',
        };
 
        if (this.formFilter.valid) {
            this.filter.emit(filterData);
        } else {
            const translatedMessage = this.translate.instant('FORM_INVALID');
            this.toastService.error(translatedMessage);
        } 
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
 */