import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    inject,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ParticipantFacade } from '@presentation/pages/team-organization/application/participant.facade';
import { TeamFilterFormInterface } from '@presentation/pages/team-organization/data-access/team/interfaces/team-filter-form.interface';
import { TeamFilterInterface } from '@presentation/pages/team-organization/data-access/team/interfaces/team-filter.interface';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { take } from 'rxjs';

@Component({
    selector: 'app-filter-team',
    templateUrl: './filter-team.component.html',
    styleUrls: ['./filter-team.component.scss'],
    standalone: true,
    imports: [
        ReactiveFormsModule,
        TranslateModule,
        SelectModule,
        InputTextModule,
        ButtonModule,
    ],
})
export class FilterTeamComponent implements OnInit {
    public formFilter!: FormGroup<TeamFilterFormInterface>;
    @Input() filterData: TeamFilterInterface = {
        code_nom: '',
        participant_id: '',
        nom_tenant: '',
        statut: '',
    };
    @Output() filter = new EventEmitter<TeamFilterInterface>();

    public participantOptions: Array<{ label: string; value: string }> = [];
    public statusOptions: Array<{ label: string; value: string }> = [];

    private readonly participantFacade = inject(ParticipantFacade);
    private readonly fb = inject(FormBuilder);
    private readonly toastService = inject(ToastrService);
    private readonly translate = inject(TranslateService);

    constructor() {
        this.initStatusOptions();
    }

    private initStatusOptions(): void {
        this.statusOptions = [
            {
                label: this.translate.instant(
                    'TEAM_ORGANIZATION.TEAM.OPTIONS.STATUS.ACTIVE'
                ),
                value: 'actif',
            },
            {
                label: this.translate.instant(
                    'TEAM_ORGANIZATION.TEAM.OPTIONS.STATUS.INACTIVE'
                ),
                value: 'inactif',
            },
        ];
    }

    ngOnInit(): void {
        this.initFormFilter();
        this.loadParticipants();
    }

    private initFormFilter(): void {
        this.formFilter = this.fb.nonNullable.group({
            code_nom: [this.filterData?.code_nom ?? ''],
            participant_id: [this.filterData?.participant_id ?? ''],
            nom_tenant: [this.filterData?.nom_tenant ?? ''],
            statut: [this.filterData?.statut ?? ''],
        });
    }

    private loadParticipants(): void {
        // Fetch participants first
        this.participantFacade.fetchParticipants();

        // Then subscribe to get the list
        this.participantFacade.items$.pipe(take(1)).subscribe({
            next: (participants) => {
                this.participantOptions = participants.map((participant) => ({
                    label: `[${participant.matricule ?? ''}] ${
                        participant.nom ?? ''
                    } ${participant.prenoms ?? ''}`.trim(),
                    value: participant.id,
                }));
            },
            error: () => {
                const message = this.translate.instant(
                    'TEAM_ORGANIZATION.TEAM.MESSAGES.ERROR.LOAD_PARTICIPANTS'
                );
                this.toastService.error(message);
            },
        });
    }

    public resetSelect(controlName: 'participant_id' | 'statut'): void {
        this.formFilter?.get(controlName)?.setValue('', { emitEvent: false });
    }

    public onSubmitFilterForm(): void {
        const payload: TeamFilterInterface = {
            code_nom: this.formFilter.value.code_nom?.trim() ?? '',
            participant_id: this.formFilter.value.participant_id ?? '',
            nom_tenant: this.formFilter.value.nom_tenant?.trim() ?? '',
            statut: this.formFilter.value.statut ?? '',
        };

        this.filter.emit(payload);
    }
}
