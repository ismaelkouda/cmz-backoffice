import { AsyncPipe, CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    inject,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProfileHabilitationFacade } from '@presentation/pages/settings-security/application/profile-habilitation.facade';
import { ProfileHabilitation } from '@presentation/pages/settings-security/domain/entities/profile-habilitation.entity';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Observable, Subject, map, of, switchMap, takeUntil } from 'rxjs';

interface ProfileHabilitationFormInterface {
    name: FormControl<string>;
    description: FormControl<string>;
}

@Component({
    selector: 'app-form-profile-habilitation',
    standalone: true,
    templateUrl: './form-profile-habilitation.component.html',
    styleUrls: ['./form-profile-habilitation.component.scss'],
    imports: [
        CommonModule,
        AsyncPipe,
        ReactiveFormsModule,
        TranslateModule,
        InputTextModule,
        ButtonModule,
        BreadcrumbComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormProfileHabilitationComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly profileHabilitationFacade = inject(
        ProfileHabilitationFacade
    );
    private readonly translate = inject(TranslateService);
    private readonly toastService = inject(ToastrService);
    private readonly fb = inject(FormBuilder);

    public formProfile!: FormGroup<ProfileHabilitationFormInterface>;
    public module!: string;
    public subModule!: string;
    public profile$!: Observable<ProfileHabilitation | null>;
    public readOnly: boolean = false;
    private readonly destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.initForm();
        this.setupRouteData();
        this.loadProfileData();
    }

    private initForm(): void {
        this.formProfile = this.fb.group<ProfileHabilitationFormInterface>({
            name: new FormControl<string>('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            description: new FormControl<string>('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });
    }

    private setupRouteData(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.title.setTitle(
                    data['title'] ??
                        'SETTINGS_SECURITY.PROFILE_HABILITATION.FORM.CREATE_TITLE'
                );
                this.module = data['module'] ?? 'SETTINGS_SECURITY.LABEL';
                this.subModule =
                    data['subModule'] ??
                    'SETTINGS_SECURITY.PROFILE_HABILITATION.LABEL';
            });

        this.activatedRoute.queryParams
            .pipe(takeUntil(this.destroy$))
            .subscribe((params) => {
                this.readOnly = params['view'] === 'true';
            });
    }

    private loadProfileData(): void {
        this.profile$ = this.activatedRoute.params.pipe(
            map((params) => params['id']),
            switchMap((id) => {
                if (id) {
                    // Load profile from facade
                    return this.profileHabilitationFacade.profileHabilitation$.pipe(
                        map(
                            (profiles) =>
                                profiles.find((p) => p.id === id) ?? null
                        )
                    );
                }
                return of(null);
            })
        );

        this.profile$.pipe(takeUntil(this.destroy$)).subscribe((profile) => {
            if (profile && this.formProfile) {
                this.formProfile.patchValue({
                    name: profile.name,
                    description: profile.description,
                });
            } else if (this.formProfile) {
                this.formProfile.reset();
            }
        });
    }

    public onCancel(): void {
        this.router.navigate(['..'], { relativeTo: this.activatedRoute });
    }

    public onSubmit(): void {
        if (this.formProfile.valid) {
            const formValue = this.formProfile.getRawValue();
            const payload = {
                name: formValue.name.trim(),
                description: formValue.description.trim(),
            };

            this.profile$
                .pipe(
                    switchMap((profile) => {
                        if (profile) {
                            return this.profileHabilitationFacade.updateProfileHabilitation(
                                {
                                    id: profile.id,
                                    ...payload,
                                }
                            );
                        }
                        return this.profileHabilitationFacade.storeProfileHabilitation(
                            payload
                        );
                    }),
                    takeUntil(this.destroy$)
                )
                .subscribe({
                    next: () => {
                        this.router.navigate(['..'], {
                            relativeTo: this.activatedRoute,
                        });
                    },
                    error: () => {
                        // Error handled in facade
                    },
                });
        } else {
            this.formProfile.markAllAsTouched();
            const translatedMessage = this.translate.instant('FORM_INVALID');
            this.toastService.error(translatedMessage);
        }
    }

    public get isEditMode(): Observable<boolean> {
        return this.profile$.pipe(map((profile) => !!profile));
    }

    public get pageTitle(): Observable<string> {
        return this.profile$.pipe(
            map((profile) =>
                profile
                    ? 'SETTINGS_SECURITY.PROFILE_HABILITATION.FORM.EDIT_TITLE'
                    : 'SETTINGS_SECURITY.PROFILE_HABILITATION.FORM.CREATE_TITLE'
            )
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
