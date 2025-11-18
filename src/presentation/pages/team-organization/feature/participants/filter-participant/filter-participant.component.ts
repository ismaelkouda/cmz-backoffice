import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    inject,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ParticipantFacade } from '@presentation/pages/team-organization/application/participant.facade';
import { TeamFacade } from '@presentation/pages/team-organization/application/team.facade';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
    selector: 'app-filter-participant',
    templateUrl: './filter-participant.component.html',
    styleUrls: ['./filter-participant.component.scss'],
    standalone: true,
    imports: [
        ReactiveFormsModule,
        TranslateModule,
        SelectModule,
        InputTextModule,
        ButtonModule,
    ],
})
export class FilterParticipantComponent implements OnInit, OnDestroy {
    public formFilter!: FormGroup;
    @Input() filterData: Record<string, any> = {};
    @Output() filter = new EventEmitter<Record<string, any>>();

    public roleOptions: Array<{ label: string; value: string }> = [];
    public statusOptions: Array<{ label: string; value: string }> = [];
    public teamOptions: Array<{ label: string; value: string }> = [];

    private readonly participantFacade = inject(ParticipantFacade);
    private readonly teamFacade = inject(TeamFacade);
    private readonly fb = inject(FormBuilder);
    private readonly toastService = inject(ToastrService);
    private readonly translate = inject(TranslateService);
    private readonly destroy$ = new Subject<void>();

    constructor() {
        this.initStatusOptions();
    }

    private initStatusOptions(): void {
        this.statusOptions = [
            {
                label: this.translate.instant(
                    'TEAM_ORGANIZATION.PARTICIPANT.OPTIONS.STATUS.ACTIVE'
                ),
                value: 'actif',
            },
            {
                label: this.translate.instant(
                    'TEAM_ORGANIZATION.PARTICIPANT.OPTIONS.STATUS.INACTIVE'
                ),
                value: 'inactif',
            },
            {
                label: this.translate.instant(
                    'TEAM_ORGANIZATION.PARTICIPANT.OPTIONS.STATUS.ASSIGNED'
                ),
                value: 'affecté',
            },
        ];
    }

    ngOnInit() {
        this.initFormFilter();
        this.loadTeams();
        this.loadRoles();
    }

    public initFormFilter(): void {
        this.formFilter = this.fb.group({
            role: [this.filterData?.['role'] ?? ''],
            statut: [this.filterData?.['statut'] ?? ''],
            team_id: [this.filterData?.['team_id'] ?? ''],
            matricule: [this.filterData?.['matricule'] ?? ''],
            nom_prenoms: [this.filterData?.['nom_prenoms'] ?? ''],
        });
    }
    private loadRoles(): void {
        this.participantFacade
            .getRoles()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (roles) => {
                    this.roleOptions = roles.map((role) => ({
                        label: role.label ?? role.name ?? String(role),
                        value: role.id ?? String(role),
                    }));
                },
                error: () => {
                    const message = this.translate.instant(
                        'TEAM_ORGANIZATION.PARTICIPANT.MESSAGES.ERROR.LOAD_ROLES'
                    );
                    this.toastService.error(message);
                },
            });
    }

    private loadTeams(): void {
        // Fetch teams first
        this.teamFacade.fetchTeams();

        // Then subscribe to get the list
        this.teamFacade.teams$.pipe(take(1)).subscribe({
            next: (teams) => {
                this.teamOptions = teams.map((team) => ({
                    label: `[${team.code ?? ''}] ${team.nom ?? ''}`.trim(),
                    value: team.id,
                }));
            },
            error: () => {
                const message = this.translate.instant(
                    'TEAM_ORGANIZATION.PARTICIPANT.MESSAGES.ERROR.LOAD_TEAMS'
                );
                this.toastService.error(message);
            },
        });
    }
    public resetSelect(controlName: 'role' | 'statut' | 'team_id'): void {
        this.formFilter.get(controlName)?.setValue('', { emitEvent: false });
    }

    public onSubmitFilterForm(): void {
        const payload = {
            role: this.formFilter.get('role')?.value ?? '',
            statut: this.formFilter.get('statut')?.value ?? '',
            team_id: this.formFilter.get('team_id')?.value ?? '',
            matricule: this.formFilter.get('matricule')?.value?.trim() ?? '',
            nom_prenoms:
                this.formFilter.get('nom_prenoms')?.value?.trim() ?? '',
        };
        this.filter.emit(payload);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
