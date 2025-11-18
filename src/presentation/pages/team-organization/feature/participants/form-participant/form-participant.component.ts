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
import { ParticipantFacade } from '@presentation/pages/team-organization/application/participant.facade';
import { ParticipantStoreRequestDto } from '@presentation/pages/team-organization/data/dtos/participant-response.dto';
import { Participant } from '@presentation/pages/team-organization/domain/entities/participant.entity';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/swalWithBootstrapButtonsParams.constant';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { Observable, Subject, map, of, switchMap, takeUntil } from 'rxjs';
import SweetAlert from 'sweetalert2';

export interface ParticipantFormInterface {
    nom: FormControl<string>;
    prenoms: FormControl<string>;
    username: FormControl<string>;
    email: FormControl<string>;
    contacts: FormControl<string>;
    adresse: FormControl<string | null>;
    role: FormControl<string>;
}

@Component({
    selector: 'app-form-participant',
    standalone: true,
    templateUrl: './form-participant.component.html',
    styleUrls: ['./form-participant.component.scss'],
    imports: [
        CommonModule,
        AsyncPipe,
        ReactiveFormsModule,
        TranslateModule,
        InputTextModule,
        SelectModule,
        ButtonModule,
        TabsModule,
        BreadcrumbComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormParticipantComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly participantFacade = inject(ParticipantFacade);
    private readonly translate = inject(TranslateService);
    private readonly fb = inject(FormBuilder);
    public formParticipant!: FormGroup<ParticipantFormInterface>;
    public module!: string;
    public subModule!: string;
    public participant$!: Observable<Participant | null>;
    public readOnly: boolean = false;
    public roleOptions$!: Observable<Array<{ label: string; value: string }>>;
    public activeTabIndex: string | number = '0';
    private readonly destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.initForm();
        this.setupRouteData();
        this.loadParticipantData();
        this.loadRoles();
    }

    private initForm(): void {
        this.formParticipant = this.fb.group<ParticipantFormInterface>({
            nom: new FormControl<string>('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            prenoms: new FormControl<string>('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            username: new FormControl<string>('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            email: new FormControl<string>('', {
                nonNullable: true,
                validators: [Validators.required, Validators.email],
            }),
            contacts: new FormControl<string>('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.pattern('^[0-9]*$'),
                    Validators.maxLength(10),
                    Validators.minLength(10),
                ],
            }),
            adresse: new FormControl<string | null>(null),
            role: new FormControl<string>('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });

        this.formParticipant
            .get('contacts')
            ?.valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value && value.length > 10) {
                    this.formParticipant
                        .get('contacts')
                        ?.setValue(value.slice(0, 10), { emitEvent: false });
                }
            });
    }

    private setupRouteData(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.title.setTitle(
                    data['title'] ??
                        'TEAM_ORGANIZATION.PARTICIPANT.FORM.CREATE_TITLE'
                );
                this.module = data['module'] ?? 'TEAM_ORGANIZATION.LABEL';
                this.subModule =
                    data['subModule'] ?? 'TEAM_ORGANIZATION.PARTICIPANT.LABEL';
            });

        this.activatedRoute.queryParams
            .pipe(takeUntil(this.destroy$))
            .subscribe((params) => {
                this.readOnly = params['view'] === 'true';
                if (this.readOnly && this.formParticipant) {
                    this.formParticipant.disable();
                }
            });
    }

    private loadParticipantData(): void {
        this.participant$ = this.activatedRoute.params.pipe(
            map((params) => params['id']),
            switchMap((id) => {
                if (id) {
                    return this.participantFacade.items$.pipe(
                        map(
                            (participants) =>
                                participants.find((p) => p.id === id) ?? null
                        )
                    );
                }
                return of(null);
            })
        );

        this.participant$
            .pipe(takeUntil(this.destroy$))
            .subscribe((participant) => {
                if (participant && this.formParticipant) {
                    this.formParticipant.patchValue({
                        nom: participant.nom,
                        prenoms: participant.prenoms,
                        username: participant.username,
                        email: participant.email,
                        contacts: participant.contacts,
                        adresse: participant.adresse,
                        role: participant.role,
                    });
                    this.formParticipant.get('username')?.disable();
                }
            });
    }

    private loadRoles(): void {
        this.roleOptions$ = this.participantFacade.getRoles().pipe(
            map((roles) =>
                roles.map((role) => ({
                    label: role.label ?? role.name,
                    value: role.id,
                }))
            )
        );
    }

    public get isEditMode(): Observable<boolean> {
        return this.participant$.pipe(map((participant) => !!participant));
    }

    public get pageTitle(): Observable<string> {
        return this.participant$.pipe(
            map((participant) =>
                participant
                    ? 'TEAM_ORGANIZATION.PARTICIPANT.FORM.EDIT_TITLE'
                    : 'TEAM_ORGANIZATION.PARTICIPANT.FORM.CREATE_TITLE'
            )
        );
    }

    public onSubmit(): void {
        if (this.formParticipant.invalid) {
            this.formParticipant.markAllAsTouched();
            return;
        }

        this.participant$
            .pipe(takeUntil(this.destroy$))
            .subscribe((participant) => {
                if (participant) {
                    this.updateParticipant();
                } else {
                    this.createParticipant();
                }
            });
    }

    private createParticipant(): void {
        const formValue = this.formParticipant.getRawValue();
        const payload: ParticipantStoreRequestDto = {
            nom: formValue.nom,
            prenoms: formValue.prenoms,
            username: formValue.username,
            email: formValue.email,
            contacts: formValue.contacts,
            adresse: formValue.adresse ?? undefined,
            role: formValue.role,
        };

        this.participantFacade
            .storeParticipant(payload)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    if (response && 'message' in response) {
                        SweetAlert.fire({
                            ...SWEET_ALERT_PARAMS,
                            icon: 'info',
                            html: String((response as any).message),
                            confirmButtonText: this.translate.instant('OK'),
                        });
                    }
                    this.onCancel();
                },
                error: () => {
                    // Error handled in facade
                },
            });
    }

    private updateParticipant(): void {
        this.participant$
            .pipe(takeUntil(this.destroy$))
            .subscribe((participant) => {
                if (!participant) {
                    return;
                }

                const formValue = this.formParticipant.getRawValue();
                const payload = {
                    participant_id: participant.id,
                    nom: formValue.nom,
                    prenoms: formValue.prenoms,
                    email: formValue.email,
                    contacts: formValue.contacts,
                    adresse: formValue.adresse ?? undefined,
                    role: formValue.role,
                };

                this.participantFacade
                    .updateParticipant(payload)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: () => {
                            this.onCancel();
                        },
                        error: () => {
                            // Error handled in facade
                        },
                    });
            });
    }

    public onCancel(): void {
        this.router.navigate(['..'], { relativeTo: this.activatedRoute });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
