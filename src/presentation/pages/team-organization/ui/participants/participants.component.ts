import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    inject,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ParticipantFacade } from '@presentation/pages/team-organization/application/participant.facade';
import { Participant } from '@presentation/pages/team-organization/domain/entities/participant.entity';
import { ParticipantFilter } from '@presentation/pages/team-organization/domain/value-objects/participant-filter.vo';
import { FilterParticipantComponent } from '@presentation/pages/team-organization/feature/participants/filter-participant/filter-participant.component';
import { TableParticipantComponent } from '@presentation/pages/team-organization/feature/participants/table-participant/table-participant.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { ExcelService } from '@shared/services/excel.service';
import { TabsModule } from 'primeng/tabs';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FORM_ROUTE, PARTICIPANT_ROUTE } from '../../team-organization.routes';

@Component({
    selector: 'app-participants',
    standalone: true,
    templateUrl: './participants.component.html',
    imports: [
        CommonModule,
        BreadcrumbComponent,
        PageTitleComponent,
        TabsModule,
        TranslateModule,
        FilterParticipantComponent,
        TableParticipantComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantsComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    private readonly translate = inject(TranslateService);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly participantFacade = inject(ParticipantFacade);
    private readonly excelService = inject(ExcelService);
    public module!: string;
    public subModule!: string;
    public participants$!: Observable<Participant[]>;
    public spinner$!: Observable<boolean>;
    public selectedParticipant: Participant | null = null;
    public activeTabIndex: string | number = '0';
    private readonly destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.title.setTitle(
                    data['title'] ?? 'TEAM_ORGANIZATION.PARTICIPANT.TITLE'
                );
                this.module = data['module'] ?? 'TEAM_ORGANIZATION.LABEL';
                this.subModule = Array.isArray(data['subModule'])
                    ? data['subModule'][0]
                    : (data['subModule'] ??
                        'TEAM_ORGANIZATION.PARTICIPANT.LABEL');
            });

        this.participants$ = this.participantFacade.items$;
        this.spinner$ = this.participantFacade.isLoading$;

        const defaultFilter = ParticipantFilter.create({
            role: '',
            statut: '',
            team_id: '',
            matricule: '',
            nom_prenoms: '',
        });
        //this.participantFacade.fetchParticipants(defaultFilter);
    }

    public filter(filterData: Record<string, unknown>): void {
        const filter = ParticipantFilter.create({
            role: (filterData['role'] as string) ?? '',
            statut: (filterData['statut'] as string) ?? '',
            team_id: (filterData['team_id'] as string) ?? '',
            matricule: (filterData['matricule'] as string) ?? '',
            nom_prenoms: (filterData['nom_prenoms'] as string) ?? '',
        });
        this.participantFacade.fetchParticipants(filter);
    }

    public onExportExcel(): void {
        this.participants$
            .pipe(takeUntil(this.destroy$))
            .subscribe((participants) => {
                const data = participants.map((participant: Participant) => ({
                    Matricule: participant?.matricule,
                    Nom: participant?.nom,
                    Prénoms: participant?.prenoms,
                    'Nom de connexion': participant?.username,
                    Contact: participant?.contacts,
                    Rôle: participant?.role,
                    Statut: participant?.statut,
                }));
                this.excelService.exportAsExcelFile(
                    data,
                    this.translate.instant(
                        'TEAM_ORGANIZATION.PARTICIPANT.TITLE'
                    )
                );
            });
    }

    public handleParticipantRequested(event: {
        participant: Participant;
        action: 'view' | 'edit' | 'delete' | 'enable' | 'disable';
    }): void {
        const { participant, action } = event;

        switch (action) {
            case 'view':
            case 'edit':
                const routePath = `${PARTICIPANT_ROUTE}/${FORM_ROUTE}/${participant.id}`;
                this.router.navigate([routePath], {
                    relativeTo: this.activatedRoute,
                    queryParams: action === 'view' ? { view: 'true' } : {},
                });
                break;
            case 'delete':
                // TODO: Implement delete confirmation and action
                break;
            case 'enable':
                // TODO: Implement enable action
                break;
            case 'disable':
                // TODO: Implement disable action
                break;
        }
    }

    public handleAddParticipant(): void {
        this.router.navigate([FORM_ROUTE], {
            relativeTo: this.activatedRoute,
        });
    }

    public handleRefresh(): void {
        const defaultFilter = ParticipantFilter.create({
            role: '',
            statut: '',
            team_id: '',
            matricule: '',
            nom_prenoms: '',
        });
        this.participantFacade.fetchParticipants(defaultFilter);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
