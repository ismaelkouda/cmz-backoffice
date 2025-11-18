import { AsyncPipe, CommonModule } from '@angular/common';
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
import { TeamFacade } from '@presentation/pages/team-organization/application/team.facade';
import { Team } from '@presentation/pages/team-organization/domain/entities/team.entity';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { Observable, Subject, map, switchMap, takeUntil } from 'rxjs';
import { ManagementTeamParticipantsComponent } from '../management-team-participants/management-team-participants.component';
import { ManagementTeamTenantsComponent } from '../management-team-tenants/management-team-tenants.component';

type TabType = 'tenants' | 'participants';

@Component({
    selector: 'app-management-team-assign',
    standalone: true,
    templateUrl: './management-team-assign.component.html',
    styleUrls: ['./management-team-assign.component.scss'],
    imports: [
        CommonModule,
        AsyncPipe,
        BreadcrumbComponent,
        ManagementTeamTenantsComponent,
        ManagementTeamParticipantsComponent,
        ButtonModule,
        TabsModule,
        TranslateModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementTeamAssignComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly translate = inject(TranslateService);
    private readonly teamFacade = inject(TeamFacade);

    public module!: string;
    public subModule!: string;
    public team$!: Observable<Team | null>;
    public teamId: string = '';
    public selectedTabViewIndex: string | number = '0';
    private readonly destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.setupRouteData();
        this.loadTeam();
    }

    private setupRouteData(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.title.setTitle(
                    data['title'] ??
                        'TEAM_ORGANIZATION.TEAM.MANAGEMENT_AFFECTED.TITLE'
                );
                this.module = data['module'] ?? 'TEAM_ORGANIZATION.LABEL';
                this.subModule =
                    data['subModule'] ?? 'TEAM_ORGANIZATION.TEAM.LABEL';
            });

        this.activatedRoute.queryParams
            .pipe(takeUntil(this.destroy$))
            .subscribe((params) => {
                const ref = params['ref'] as string;
                if (ref === 'participants') {
                    this.selectedTabViewIndex = '1';
                } else {
                    this.selectedTabViewIndex = '0';
                }
            });
    }

    private loadTeam(): void {
        this.team$ = this.activatedRoute.params.pipe(
            map((params) => params['id']),
            switchMap((id) => {
                this.teamId = id;
                if (id) {
                    return this.teamFacade.teams$.pipe(
                        map((teams) => teams.find((t) => t.id === id) ?? null)
                    );
                }
                return new Observable<null>((observer) => {
                    observer.next(null);
                    observer.complete();
                });
            })
        );
    }

    public handleChangeTabViewIndex(tabViewIndex: string | number): void {
        this.selectedTabViewIndex = tabViewIndex;
    }

    public onClose(): void {
        this.router.navigate(['..'], { relativeTo: this.activatedRoute });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
