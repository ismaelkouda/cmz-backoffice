import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AgentFilterFormInterface } from '@presentation/pages/team-organization/data-access/agent/interfaces/agent-filter-form.interface';
import { AgentFilterInterface } from '@presentation/pages/team-organization/data-access/agent/interfaces/agent-filter.interface';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'app-filter-agent-ia',
    templateUrl: './filter-agent-ia.component.html',
    styleUrls: ['./filter-agent-ia.component.scss'],
    standalone: true,
    imports: [
        ReactiveFormsModule,
        TranslateModule,
        SelectModule,
        InputTextModule,
        ButtonModule,
    ],
})
export class FilterAgentIaComponent implements OnInit {
    public formFilter!: FormGroup<AgentFilterFormInterface>;
    @Input() filterData: AgentFilterInterface = {
        code_nom: '',
        statut: '',
    };
    @Output() filter = new EventEmitter<AgentFilterInterface>();

    public statusOptions: Array<{ label: string; value: string }> = [];

    constructor(
        private fb: FormBuilder,
        private toastService: ToastrService,
        private translate: TranslateService
    ) {
        this.initStatusOptions();
    }

    private initStatusOptions(): void {
        this.statusOptions = [
            {
                label: this.translate.instant(
                    'TEAM_ORGANIZATION.AGENT_IA.OPTIONS.STATUS.ACTIVE'
                ),
                value: 'actif',
            },
            {
                label: this.translate.instant(
                    'TEAM_ORGANIZATION.AGENT_IA.OPTIONS.STATUS.INACTIVE'
                ),
                value: 'inactif',
            },
        ];
    }

    ngOnInit(): void {
        this.initFormFilter();
    }

    private initFormFilter(): void {
        this.formFilter = this.fb.nonNullable.group({
            code_nom: [this.filterData?.code_nom ?? ''],
            statut: [this.filterData?.statut ?? ''],
        });
    }

    public resetSelect(controlName: 'statut'): void {
        this.formFilter.get(controlName)?.setValue('', { emitEvent: false });
    }

    public onSubmitFilterForm(): void {
        const payload: AgentFilterInterface = {
            code_nom:
                this.formFilter.get('code_nom')?.value?.trim() ?? undefined,
            statut: this.formFilter.get('statut')?.value ?? undefined,
        };

        this.filter.emit(payload);
    }
}
