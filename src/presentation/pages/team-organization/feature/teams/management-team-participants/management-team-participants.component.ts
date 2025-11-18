import { AsyncPipe, CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnDestroy,
    OnInit,
    inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TeamFacade } from '@presentation/pages/team-organization/application/team.facade';
import { Participant } from '@presentation/pages/team-organization/domain/entities/participant.entity';
import { SWEET_ALERT_PARAMS } from '@shared/constants/swalWithBootstrapButtonsParams.constant';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { FilterTeamParticipantsComponent } from '../filter-team-participants/filter-team-participants.component';
import { ModalReassignParticipantsComponent } from '../modal-reassign-participants/modal-reassign-participants.component';
import { TableTeamParticipantsComponent } from '../table-team-participants/table-team-participants.component';

interface TeamParticipantsFilterInterface {
    matricule?: string;
}

@Component({
    selector: 'app-management-team-participants',
    standalone: true,
    templateUrl: './management-team-participants.component.html',
    styleUrls: ['./management-team-participants.component.scss'],
    imports: [
        CommonModule,
        AsyncPipe,
        FilterTeamParticipantsComponent,
        TableTeamParticipantsComponent,
        ModalReassignParticipantsComponent,
        TranslateModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementTeamParticipantsComponent implements OnInit, OnDestroy {
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly translate = inject(TranslateService);
    private readonly teamFacade = inject(TeamFacade);

    @Input() teamId: string = '';

    public participants$!: Observable<Participant[]>;
    public spinner$!: Observable<boolean>;
    public selectedParticipants: Participant[] = [];
    public visibleReassignModal: boolean = false;
    private readonly destroy$ = new Subject<void>();
    private readonly participantsSubject = new BehaviorSubject<Participant[]>(
        []
    );

    ngOnInit(): void {
        this.participants$ = this.participantsSubject.asObservable();
        this.spinner$ = this.teamFacade.isLoading$;
        this.loadParticipants();
    }

    private loadParticipants(filter?: TeamParticipantsFilterInterface): void {
        if (!this.teamId) {
            return;
        }

        this.teamFacade
            .getParticipantsByTeam(this.teamId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (participants) => {
                    let filteredParticipants = participants;
                    if (filter?.matricule) {
                        filteredParticipants = participants.filter((p) =>
                            p.matricule
                                ?.toLowerCase()
                                .includes(filter.matricule!.toLowerCase())
                        );
                    }
                    this.participantsSubject.next(filteredParticipants);
                },
                error: () => {
                    this.participantsSubject.next([]);
                },
            });
    }

    public filter(filterData: TeamParticipantsFilterInterface): void {
        this.loadParticipants(filterData);
    }

    public onSelectionChange(participants: Participant[]): void {
        this.selectedParticipants = participants;
    }

    public onAssign(): void {
        this.router.navigate(['assign-participants'], {
            relativeTo: this.router.routerState.root.children[0],
        });
    }

    public onRemove(participants: Participant[]): void {
        if (participants.length === 0 || !this.teamId) {
            return;
        }

        Swal.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant(
                'TEAM_ORGANIZATION.TEAM.MANAGEMENT_AFFECTED.CONFIRM.RETIRE_PARTICIPANTS_TITLE'
            ),
            text: this.translate.instant(
                'TEAM_ORGANIZATION.TEAM.MANAGEMENT_AFFECTED.CONFIRM.RETIRE_PARTICIPANTS_MESSAGE',
                { count: participants.length }
            ),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant(
                'TEAM_ORGANIZATION.TEAM.MANAGEMENT_AFFECTED.BUTTONS.RETIRE'
            ),
            cancelButtonText: this.translate.instant('CANCEL'),
        }).then((result) => {
            if (result.isConfirmed && this.teamId) {
                const participantIds = participants.map((p) => p.id);
                this.teamFacade
                    .removeParticipants({
                        equipe_id: this.teamId,
                        participant_ids: participantIds,
                    })
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: () => {
                            this.selectedParticipants = [];
                            this.loadParticipants();
                        },
                        error: () => {
                            // Error handled in facade
                        },
                    });
            }
        });
    }

    public onReassign(participants: Participant[]): void {
        if (participants.length === 0 || !this.teamId) {
            return;
        }
        this.selectedParticipants = [...participants];
        this.visibleReassignModal = true;
    }

    public onReassignConfirm(event: {
        newTeamId: string;
        participantIds: string[];
    }): void {
        if (!this.teamId) {
            return;
        }
        this.teamFacade
            .reassignParticipants({
                equipe_id: this.teamId,
                new_equipe_id: event.newTeamId,
                participant_ids: event.participantIds,
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.selectedParticipants = [];
                    this.loadParticipants();
                },
                error: () => {
                    // Error handled in facade
                },
            });
    }

    public refreshParticipants(): void {
        this.loadParticipants();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
