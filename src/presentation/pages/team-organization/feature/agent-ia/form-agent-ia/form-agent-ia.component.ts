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
import { AgentFacade } from '@presentation/pages/team-organization/application/agent.facade';
import { AgentIa } from '@presentation/pages/team-organization/domain/entities/agent-ia.entity';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Observable, Subject, map, of, switchMap, takeUntil } from 'rxjs';

interface AgentFormInterface {
    code: FormControl<string>;
    nom: FormControl<string>;
    description: FormControl<string>;
}

@Component({
    selector: 'app-form-agent-ia',
    standalone: true,
    templateUrl: './form-agent-ia.component.html',
    styleUrls: ['./form-agent-ia.component.scss'],
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
export class FormAgentIaComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly agentFacade = inject(AgentFacade);
    private readonly translate = inject(TranslateService);
    private readonly toastService = inject(ToastrService);
    private readonly fb = inject(FormBuilder);

    public formAgent!: FormGroup<AgentFormInterface>;
    public module!: string;
    public subModule!: string;
    public agent$!: Observable<AgentIa | null>;
    public readOnly: boolean = false;
    private readonly destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.initForm();
        this.setupRouteData();
        this.loadAgentData();
    }

    private initForm(): void {
        this.formAgent = this.fb.group<AgentFormInterface>({
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
                    data['title'] ??
                    'TEAM_ORGANIZATION.AGENT_IA.FORM.CREATE_TITLE'
                );
                this.module = data['module'] ?? 'TEAM_ORGANIZATION.LABEL';
                this.subModule =
                    data['subModule'] ?? 'TEAM_ORGANIZATION.AGENT_IA.LABEL';
            });

        this.activatedRoute.queryParams
            .pipe(takeUntil(this.destroy$))
            .subscribe((params) => {
                this.readOnly = params['view'] === 'true';
            });
    }

    private loadAgentData(): void {
        this.agent$ = this.activatedRoute.params.pipe(
            map((params) => params['id']),
            switchMap((id) => {
                if (id) {
                    return this.agentFacade.agents$.pipe(
                        map((agents) => agents.find((a) => a.id === id) ?? null)
                    );
                }
                return of(null);
            })
        );

        this.agent$.pipe(takeUntil(this.destroy$)).subscribe((agent) => {
            if (agent && this.formAgent) {
                this.formAgent.patchValue({
                    code: agent.code,
                    nom: agent.nom,
                    description: agent.description ?? '',
                });
            } else if (this.formAgent) {
                this.formAgent.reset();
            }
        });
    }

    public onCancel(): void {
        this.router.navigate(['..'], { relativeTo: this.activatedRoute });
    }

    public onSubmit(): void {
        if (this.formAgent.valid) {
            const formValue = this.formAgent.getRawValue();
            const payload = {
                code: formValue.code.trim(),
                nom: formValue.nom.trim(),
                description: formValue.description.trim() || undefined,
            };

            this.agent$
                .pipe(
                    switchMap((agent) => {
                        if (agent) {
                            return this.agentFacade.updateAgent({
                                agent_ia_id: agent.id,
                                nom: payload.nom,
                                description: payload.description,
                            });
                        }
                        return this.agentFacade.storeAgent(payload);
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
            this.formAgent.markAllAsTouched();
            const translatedMessage = this.translate.instant('COMMON.FORM_INVALID');
            this.toastService.error(translatedMessage);
        }
    }

    public get isEditMode(): Observable<boolean> {
        return this.agent$.pipe(map((agent) => !!agent));
    }

    public get pageTitle(): Observable<string> {
        return this.agent$.pipe(
            map((agent) =>
                agent
                    ? 'TEAM_ORGANIZATION.AGENT_IA.FORM.EDIT_TITLE'
                    : 'TEAM_ORGANIZATION.AGENT_IA.FORM.CREATE_TITLE'
            )
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
