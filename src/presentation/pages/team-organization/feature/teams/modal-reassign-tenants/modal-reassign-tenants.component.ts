import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    inject,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TeamFacade } from '@presentation/pages/team-organization/application/team.facade';
import { Tenant } from '@presentation/pages/team-organization/domain/entities/tenant.entity';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { Observable, Subject, map } from 'rxjs';

export interface ReassignTenantsFormInterface {
    newTeamId: FormControl<string>;
}

export interface TeamOption {
    id: string;
    code: string;
    nom: string;
}

@Component({
    selector: 'app-modal-reassign-tenants',
    standalone: true,
    templateUrl: './modal-reassign-tenants.component.html',
    styleUrls: ['./modal-reassign-tenants.component.scss'],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule,
        DialogModule,
        SelectModule,
        ButtonModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalReassignTenantsComponent implements OnInit, OnDestroy {
    @Input() visible: boolean = false;
    @Input() teamId: string = '';
    @Input() tenants: Tenant[] = [];
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() confirm = new EventEmitter<{
        newTeamId: string;
        tenantIds: string[];
    }>();

    private readonly teamFacade = inject(TeamFacade);
    private readonly translate = inject(TranslateService);
    private readonly toastService = inject(ToastrService);
    private readonly fb = inject(FormBuilder);

    public formReassign!: FormGroup<ReassignTenantsFormInterface>;
    public teamOptions$!: Observable<TeamOption[]>;
    private readonly destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.initForm();
        this.loadTeams();
    }

    private initForm(): void {
        this.formReassign = this.fb.group<ReassignTenantsFormInterface>({
            newTeamId: new FormControl<string>('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });
    }

    private loadTeams(): void {
        this.teamOptions$ = this.teamFacade
            .getTeamsWithoutTenant(this.teamId)
            .pipe(
                map((teams) =>
                    (teams || []).map((t) => ({
                        id: t.id,
                        code: t.code,
                        nom: t.nom,
                    }))
                )
            );
    }

    public onHide(): void {
        this.visibleChange.emit(false);
        this.formReassign.reset();
    }

    public onSubmit(): void {
        if (this.formReassign.valid && this.tenants.length > 0) {
            const newTeamId = this.formReassign.get('newTeamId')?.value ?? '';
            const tenantIds = this.tenants.map((t) => t.id);
            this.confirm.emit({ newTeamId, tenantIds });
            this.onHide();
        } else {
            this.formReassign.markAllAsTouched();
            if (this.tenants.length === 0) {
                this.toastService.error(
                    this.translate.instant(
                        'TEAM_ORGANIZATION.TEAM.MANAGEMENT_AFFECTED.MESSAGES.NO_SELECTION'
                    )
                );
            } else {
                this.toastService.error(this.translate.instant('FORM_INVALID'));
            }
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
