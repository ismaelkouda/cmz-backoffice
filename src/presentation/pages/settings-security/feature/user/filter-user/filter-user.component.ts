import {
    Component,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserFacade } from '@presentation/pages/settings-security/application/user.facade';
import { UserFilterFormInterface } from '@presentation/pages/settings-security/data-access/user/interfaces/user-filter-form.interface';
import { UserFilterInterface } from '@presentation/pages/settings-security/data-access/user/interfaces/user-filter.interface';
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
    @Output() filter = new EventEmitter<UserFilterInterface>();

    public formFilter!: FormGroup<UserFilterFormInterface>;
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

    readonly stateOptions = [
        {
            value: 'active',
            label: 'SETTINGS_SECURITY.USER.LABELS.STATUS.ACTIVE',
        },
        {
            value: 'inactive',
            label: 'SETTINGS_SECURITY.USER.LABELS.STATUS.INACTIVE',
        },
    ] as const;

    constructor(
        private readonly toastService: ToastrService,
        private readonly fb: FormBuilder,
        private readonly translate: TranslateService,
        private readonly userFacade: UserFacade
    ) {}

    ngOnInit(): void {
        this.initFormFilter();
    }

    public initFormFilter(): void {
        // Initialiser le formulaire une seule fois avec des valeurs vides
        if (!this.formFilter) {
            this.formFilter = this.fb.group<UserFilterFormInterface>({
                user_profile: new FormControl<string>('', {
                    nonNullable: true,
                }),
                state: new FormControl<string>('', {
                    nonNullable: true,
                }),
                matricule: new FormControl<string>('', {
                    nonNullable: true,
                }),
                search: new FormControl<string>('', {
                    nonNullable: true,
                }),
            });
        }

        // Mettre à jour le formulaire avec les valeurs du filtre actuel
        this.userFacade.currentFilter$
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterValue) => {
                if (!this.formFilter) {
                    return;
                }

                const dto =
                    typeof filterValue?.toDto === 'function'
                        ? filterValue.toDto()
                        : {};

                // Mettre à jour les valeurs sans recréer le formulaire
                this.formFilter.patchValue(
                    {
                        user_profile: dto['user_profile'] ?? '',
                        state: dto['state'] ?? '',
                        matricule: dto['matricule'] ?? '',
                        search: dto['search'] ?? '',
                    },
                    { emitEvent: false }
                );
            });
    }

    public resetSelect<K extends keyof UserFilterFormInterface>(
        controlName: K
    ): void {
        const control = this.formFilter?.controls[controlName];
        if (control) {
            control.setValue('', { emitEvent: false });
        }
    }

    public onSubmitFilterForm(): void {
        const filterData: UserFilterInterface = {
            user_profile:
                this.formFilter.get('user_profile')?.value?.trim() ?? '',
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
