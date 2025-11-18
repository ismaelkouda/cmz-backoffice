import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseFacade } from '@presentation/pages/team-organization/application/base/base-facade';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, tap } from 'rxjs';
import {
    ParticipantStoreRequestDto,
    ParticipantUpdateRequestDto,
    RoleDto,
} from '../data/dtos/participant-response.dto';
import { Participant } from '../domain/entities/participant.entity';
import {
    DeleteParticipantUseCase,
    DisableParticipantUseCase,
    EnableParticipantUseCase,
    FetchParticipantsUseCase,
    GetRolesUseCase,
    StoreParticipantUseCase,
    UpdateParticipantUseCase,
} from '../domain/use-cases/participant.use-case';
import { ParticipantFilter } from '../domain/value-objects/participant-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class ParticipantFacade extends BaseFacade<
    Participant,
    ParticipantFilter
> {
    constructor(
        private readonly fetchParticipantsUseCase: FetchParticipantsUseCase,
        private readonly storeParticipantUseCase: StoreParticipantUseCase,
        private readonly updateParticipantUseCase: UpdateParticipantUseCase,
        private readonly deleteParticipantUseCase: DeleteParticipantUseCase,
        private readonly enableParticipantUseCase: EnableParticipantUseCase,
        private readonly disableParticipantUseCase: DisableParticipantUseCase,
        private readonly getRolesUseCase: GetRolesUseCase,
        toastService: ToastrService,
        translateService: TranslateService
    ) {
        super(toastService, translateService);
    }

    fetchParticipants(
        filter: ParticipantFilter = ParticipantFilter.create()
    ): void {
        const fetch$ = this.fetchParticipantsUseCase.execute(filter);
        this.fetchData(filter, fetch$);
    }

    refresh(): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) {
            return;
        }
        const fetch$ = this.fetchParticipantsUseCase.execute(currentFilter);
        this.fetchData(currentFilter, fetch$);
    }

    storeParticipant(
        payload: ParticipantStoreRequestDto
    ): Observable<Participant> {
        return this.storeParticipantUseCase.execute(payload).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'TEAM_ORGANIZATION.PARTICIPANT.MESSAGES.STORE_SUCCESS'
                );
                this.toastService.success(successMessage);
            }),
            map((participant) => participant)
        );
    }

    updateParticipant(
        payload: ParticipantUpdateRequestDto
    ): Observable<Participant> {
        return this.updateParticipantUseCase.execute(payload).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'TEAM_ORGANIZATION.PARTICIPANT.MESSAGES.UPDATE_SUCCESS'
                );
                this.toastService.success(successMessage);
            }),
            map((participant) => participant)
        );
    }

    deleteParticipant(id: string): Observable<void> {
        return this.deleteParticipantUseCase.execute(id).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'TEAM_ORGANIZATION.PARTICIPANT.MESSAGES.DELETE_SUCCESS'
                );
                this.toastService.success(successMessage);
            }),
            map(() => undefined)
        );
    }

    enableParticipant(id: string): Observable<void> {
        return this.enableParticipantUseCase.execute(id).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'TEAM_ORGANIZATION.PARTICIPANT.MESSAGES.ENABLE_SUCCESS'
                );
                this.toastService.success(successMessage);
            }),
            map(() => undefined)
        );
    }

    disableParticipant(id: string): Observable<void> {
        return this.disableParticipantUseCase.execute(id).pipe(
            tap(() => {
                this.refresh();
                const successMessage = this.translateService.instant(
                    'TEAM_ORGANIZATION.PARTICIPANT.MESSAGES.DISABLE_SUCCESS'
                );
                this.toastService.success(successMessage);
            }),
            map(() => undefined)
        );
    }

    getRoles(): Observable<RoleDto[]> {
        return this.getRolesUseCase.execute();
    }
}
