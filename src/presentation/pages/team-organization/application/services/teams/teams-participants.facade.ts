import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseFacade } from '@shared/application/base/base-facade';
import {
    handleObservableWithFeedback,
    shouldFetch,
} from '@shared/application/base/facade.utils';
import { UiFeedbackService } from '@shared/application/ui/ui-feedback.service';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';

import { TeamsParticipantsFilterDto } from '@presentation/pages/team-organization/application/dtos/teams/teams-participants-filter.dto';
import { TeamsParticipantsReassignDto } from '@presentation/pages/team-organization/application/dtos/teams/teams-participants-reassign.dto';
import { TeamsParticipantsRemoveDto } from '@presentation/pages/team-organization/application/dtos/teams/teams-participants-remove.dto';
import { TeamsParticipantsUseCase } from '@presentation/pages/team-organization/application/use-cases/teams/teams-participants.use-case';
import { TeamsParticipantsEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-participants.entity';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TeamsParticipantsReassignCommand } from '../../commands/teams/teams-participants-reassign.command';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

@Injectable({
    providedIn: 'root',
})
export class TeamsParticipantsFacade extends BaseFacade<
    TeamsParticipantsEntity,
    TeamsParticipantsFilterDto
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly useCase = inject(TeamsParticipantsUseCase);

    readonly item$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    private handleActionWithRefresh<T>(
        observable: Observable<T>,
        successKey: string
    ): Observable<T> {
        return handleObservableWithFeedback(
            observable,
            this.uiFeedbackService,
            successKey,
            () => this.refresh()
        );
    }

    readAll(
        filter: TeamsParticipantsFilterDto,
        page: string = PAGINATION_CONST.DEFAULT_PAGE,
        forceRefresh = false
    ): void {
        const hasData = this.itemsSubject.getValue().length > 0;
        if (
            !shouldFetch(
                forceRefresh,
                hasData,
                this.lastFetchTimestamp,
                this.STALE_TIME
            )
        ) {
            return;
        }

        this.fetchWithFilterAndPage(
            filter,
            page,
            this.useCase.readAll.bind(this.useCase),
            this.uiFeedbackService
        );

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }

    refresh(): void {
        const uniqId = this.filterSubject.getValue()?.uniqId ?? '';
        const firstPage = PAGINATION_CONST.DEFAULT_PAGE;
        this.fetchWithFilterAndPage(
            { uniqId },
            firstPage,
            this.useCase.readAll.bind(this.useCase),
            this.uiFeedbackService
        );
        this.lastFetchTimestamp = Date.now();
    }

    changePage(pageNumber: number): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) {
            return;
        }
        this.fetchWithFilterAndPage(
            currentFilter,
            String(pageNumber),
            this.useCase.readAll.bind(this.useCase),
            this.uiFeedbackService
        );
        this.lastFetchTimestamp = Date.now();
    }

    resetMemory(): void {
        this.hasInitialized = false;
        this.lastFetchTimestamp = 0;
        this.reset();
    }

    getMemoryStatus(): {
        hasInitialized: boolean;
        lastFetch: number;
        hasData: boolean;
    } {
        return {
            hasInitialized: this.hasInitialized,
            lastFetch: this.lastFetchTimestamp,
            hasData: this.itemsSubject.getValue() !== null,
        };
    }

    reassign(command: TeamsParticipantsReassignCommand): Observable<SimpleResponseDto<void>> {
        return this.handleActionWithRefresh(
            this.useCase.reassign(command),
            'COMMON.SUCCESS.UPDATE'
        );
    }
    

    remove(dto: TeamsParticipantsRemoveDto) {
        return this.handleActionWithRefresh(
            this.useCase.remove(dto),
            'COMMON.SUCCESS.UPDATE'
        );
    }
}
