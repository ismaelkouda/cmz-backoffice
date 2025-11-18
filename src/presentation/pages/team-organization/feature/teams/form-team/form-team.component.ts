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
import { TeamFacade } from '@presentation/pages/team-organization/application/team.facade';
import { Team } from '@presentation/pages/team-organization/domain/entities/team.entity';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Observable, Subject, map, of, switchMap, takeUntil } from 'rxjs';

interface TeamFormInterface {
    code: FormControl<string>;
    nom: FormControl<string>;
    description: FormControl<string>;
}

@Component({
    selector: 'app-form-team',
    standalone: true,
    templateUrl: './form-team.component.html',
    styleUrls: ['./form-team.component.scss'],
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
export class FormTeamComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly teamFacade = inject(TeamFacade);
    private readonly translate = inject(TranslateService);
    private readonly toastService = inject(ToastrService);
    private readonly fb = inject(FormBuilder);

    public formTeam!: FormGroup<TeamFormInterface>;
    public module!: string;
    public subModule!: string;
    public team$!: Observable<Team | null>;
    public readOnly: boolean = false;
    private readonly destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.initForm();
        this.setupRouteData();
        this.loadTeamData();
    }

    private initForm(): void {
        this.formTeam = this.fb.group<TeamFormInterface>({
            code: new FormControl<string>('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            nom: new FormControl<string>('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            description: new FormControl<string>('', {
                nonNullable: true,
            }),
        });
    }

    private setupRouteData(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.title.setTitle(
                    data['title'] ?? 'TEAM_ORGANIZATION.TEAM.FORM.CREATE_TITLE'
                );
                this.module = data['module'] ?? 'TEAM_ORGANIZATION.LABEL';
                this.subModule =
                    data['subModule'] ?? 'TEAM_ORGANIZATION.TEAM.LABEL';
            });

        this.activatedRoute.queryParams
            .pipe(takeUntil(this.destroy$))
            .subscribe((params) => {
                this.readOnly = params['view'] === 'true';
            });
    }

    private loadTeamData(): void {
        this.team$ = this.activatedRoute.params.pipe(
            map((params) => params['id']),
            switchMap((id) => {
                if (id) {
                    return this.teamFacade.teams$.pipe(
                        map((teams) => teams.find((t) => t.id === id) ?? null)
                    );
                }
                return of(null);
            })
        );

        this.team$.pipe(takeUntil(this.destroy$)).subscribe((team) => {
            if (team && this.formTeam) {
                this.formTeam.patchValue({
                    code: team.code,
                    nom: team.nom,
                    description: team.description ?? '',
                });
            } else if (this.formTeam) {
                this.formTeam.reset();
            }
        });
    }

    public onCancel(): void {
        this.router.navigate(['..'], { relativeTo: this.activatedRoute });
    }

    public onSubmit(): void {
        if (this.formTeam.valid) {
            const formValue = this.formTeam.getRawValue();
            const payload = {
                code: formValue.code.trim(),
                nom: formValue.nom.trim(),
                description: formValue.description.trim() || undefined,
            };

            this.team$
                .pipe(
                    takeUntil(this.destroy$),
                    switchMap((team) => {
                        if (team) {
                            return this.teamFacade.updateTeam({
                                equipe_id: team.id,
                                nom: payload.nom,
                                description: payload.description,
                            });
                        }
                        return this.teamFacade.storeTeam(payload);
                    })
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
            this.formTeam.markAllAsTouched();
            const translatedMessage = this.translate.instant('FORM_INVALID');
            this.toastService.error(translatedMessage);
        }
    }

    public get isEditMode(): Observable<boolean> {
        return this.team$.pipe(map((team) => !!team));
    }

    public get pageTitle(): Observable<string> {
        return this.team$.pipe(
            map((team) =>
                team
                    ? 'TEAM_ORGANIZATION.TEAM.FORM.EDIT_TITLE'
                    : 'TEAM_ORGANIZATION.TEAM.FORM.CREATE_TITLE'
            )
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
