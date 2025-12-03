/* import {
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
import { ProfileHabilitationFilterFormInterface } from '@pages/settings-security/data-access/profile-habilitation/interfaces/profile-habilitation-filter-form.interface';
import { ProfileHabilitationFilterInterface } from '@pages/settings-security/data-access/profile-habilitation/interfaces/profile-habilitation-filter.interface';
import { ProfileHabilitationFacade } from '@presentation/pages/settings-security/application/profile-habilitation.facade';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { Subject, takeUntil } from 'rxjs';

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
export class FilterProfileHabilitationComponent implements OnInit, OnDestroy {
    @Output() filter = new EventEmitter<ProfileHabilitationFilterInterface>();

    public formFilter!: FormGroup<ProfileHabilitationFilterFormInterface>;
    private readonly destroy$ = new Subject<void>();

    readonly profileOptions = [
        {
            value: 'admin',
            label: 'SETTINGS_SECURITY.PROFILE_HABILITATION.OPTIONS.PROFILE.ADMIN',
        },
        {
            value: 'user',
            label: 'SETTINGS_SECURITY.PROFILE_HABILITATION.OPTIONS.PROFILE.USER',
        },
    ] as const;

    readonly stateOptions = [
        {
            value: 'active',
            label: 'SETTINGS_SECURITY.PROFILE_HABILITATION.LABELS.STATUS.ACTIVE',
        },
        {
            value: 'inactive',
            label: 'SETTINGS_SECURITY.PROFILE_HABILITATION.LABELS.STATUS.INACTIVE',
        },
    ] as const;

    constructor(
        private readonly toastService: ToastrService,
        private readonly fb: FormBuilder,
        private readonly translate: TranslateService,
        private readonly profileHabilitationFacade: ProfileHabilitationFacade
    ) {}

    ngOnInit(): void {
        this.initFormFilter();
    }

    public initFormFilter(): void {
        // Initialiser le formulaire une seule fois avec des valeurs vides
        if (!this.formFilter) {
            this.formFilter =
                this.fb.group<ProfileHabilitationFilterFormInterface>({
                    profile: new FormControl<string>('', {
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
        this.profileHabilitationFacade.currentFilter$
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
                        profile: dto['profile'] ?? '',
                        state: dto['state'] ?? '',
                        matricule: dto['matricule'] ?? '',
                        search: dto['search'] ?? '',
                    },
                    { emitEvent: false }
                );
            });
    }

    public resetSelect<K extends keyof ProfileHabilitationFilterFormInterface>(
        controlName: K
    ): void {
        const control = this.formFilter?.controls[controlName];
        if (control) {
            control.setValue('', { emitEvent: false });
        }
    }

    public onSubmitFilterForm(): void {
        const filterData: ProfileHabilitationFilterInterface = {
            profile: this.formFilter.get('profile')?.value?.trim() ?? '',
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