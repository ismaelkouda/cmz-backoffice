import { Injectable, inject, signal } from '@angular/core';
import { SiteGroupCoverageAreasAssignCommand } from '@pages/coverage-areas/application/commands/site-group/site-group-coverage-areas-assign.command';
import { SiteGroupCoverageAreasReassignCommand } from '@pages/coverage-areas/application/commands/site-group/site-group-coverage-areas-reassign.command';
import { SiteGroupCoverageAreasRemoveCommand } from '@pages/coverage-areas/application/commands/site-group/site-group-coverage-areas-remove.command';
import { SiteGroupCoverageAreasAssignBus } from '@pages/coverage-areas/application/commands-bus/site-group/site-group-coverage-areas-assign.bus';
import { SiteGroupCoverageAreasReassignBus } from '@pages/coverage-areas/application/commands-bus/site-group/site-group-coverage-areas-reassign.bus';
import { SiteGroupCoverageAreasRemoveBus } from '@pages/coverage-areas/application/commands-bus/site-group/site-group-coverage-areas-remove.bus';
import { SiteGroupCoverageAreasQuery } from '@pages/coverage-areas/application/queries/site-group/site-group-coverage-areas.query';
import { SiteGroupCoverageAreasUnassignedQuery } from '@pages/coverage-areas/application/queries/site-group/site-group-coverage-areas-unassigned.query';
import { SiteGroupCoverageAreasBus } from '@pages/coverage-areas/application/queries-bus/site-group/site-group-coverage-areas.bus';
import { SiteGroupCoverageAreasUnassignedBus } from '@pages/coverage-areas/application/queries-bus/site-group/site-group-coverage-areas-unassigned.bus';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { handleObservableWithFeedback } from '@shared/application/services/facade.utils';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { SiteGroupCoverageAreaEntity } from '@pages/coverage-areas/domain/entities/site-group/site-group-coverage-area.entity';
import { SiteGroupCoverageAreaSelectionEntity } from '@pages/coverage-areas/domain/entities/site-group/site-group-coverage-area-selection.entity';

@Injectable({ providedIn: 'root' })
export class SiteGroupCoverageAreasFacade {
    private readonly ui = inject(UiFeedbackService);
    private readonly queryBus = inject(SiteGroupCoverageAreasBus);
    private readonly unassignedQueryBus = inject(
        SiteGroupCoverageAreasUnassignedBus
    );
    private readonly assignBus = inject(SiteGroupCoverageAreasAssignBus);
    private readonly reassignBus = inject(SiteGroupCoverageAreasReassignBus);
    private readonly removeBus = inject(SiteGroupCoverageAreasRemoveBus);

    readonly items = signal<SiteGroupCoverageAreaEntity[]>([]);
    readonly unassignedItems = signal<SiteGroupCoverageAreaSelectionEntity[]>(
        []
    );
    readonly loading = signal(false);
    readonly actionState = signal<'idle' | 'loading'>('idle');
    readonly actionSuccess = signal(0);

    read(siteGroupId: number, forceRefresh = false): void {
        this.loading.set(true);
        this.queryBus
            .dispatch(new SiteGroupCoverageAreasQuery(siteGroupId), {
                forceRefresh,
            })
            .pipe(
                tap((response) => this.items.set(response.coverageAreas)),
                catchError((error) => {
                    this.items.set([]);
                    return throwError(() => error);
                }),
                finalize(() => this.loading.set(false))
            )
            .subscribe();
    }

    readUnassigned(forceRefresh = false): void {
        this.unassignedQueryBus
            .dispatch(new SiteGroupCoverageAreasUnassignedQuery(), {
                forceRefresh,
            })
            .pipe(
                tap((response) => this.unassignedItems.set(response)),
                catchError((error) => {
                    this.unassignedItems.set([]);
                    return throwError(() => error);
                })
            )
            .subscribe();
    }

    assign(siteGroupId: number, coverageAreaIds: number[]): void {
        this.executeAction(
            this.assignBus.dispatch(
                new SiteGroupCoverageAreasAssignCommand(
                    siteGroupId,
                    coverageAreaIds
                )
            ),
            'COMMON.SUCCESS.UPDATE',
            () => this.read(siteGroupId, true)
        );
    }

    reassign(
        siteGroupId: number,
        coverageAreaIds: number[],
        targetSiteGroupId: string | number
    ): void {
        this.executeAction(
            this.reassignBus.dispatch(
                new SiteGroupCoverageAreasReassignCommand(
                    siteGroupId,
                    coverageAreaIds,
                    Number(targetSiteGroupId)
                )
            ),
            'COMMON.SUCCESS.UPDATE',
            () => this.read(siteGroupId, true)
        );
    }

    remove(siteGroupId: number, coverageAreaIds: number[]): void {
        this.executeAction(
            this.removeBus.dispatch(
                new SiteGroupCoverageAreasRemoveCommand(
                    siteGroupId,
                    coverageAreaIds
                )
            ),
            'COMMON.SUCCESS.UPDATE',
            () => this.read(siteGroupId, true)
        );
    }

    private executeAction(
        request: Observable<unknown>,
        successKey: string,
        refresh: () => void
    ): void {
        this.actionState.set('loading');
        handleObservableWithFeedback(request, this.ui, successKey, refresh)
            .pipe(
                tap(() => this.actionSuccess.update((value) => value + 1)),
                catchError((error) => throwError(() => error)),
                finalize(() => this.actionState.set('idle'))
            )
            .subscribe();
    }
}
