import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Participant } from '../../domain/entities/participant.entity';
import { ParticipantRepository } from '../../domain/repositories/participant.repository';
import { ParticipantFilter } from '../../domain/value-objects/participant-filter.vo';
import {
    ParticipantDeleteResponseDto,
    ParticipantDisableResponseDto,
    ParticipantEnableResponseDto,
    ParticipantStoreRequestDto,
    ParticipantUpdateRequestDto,
    RoleDto,
} from '../dtos/participant-response.dto';
import { ParticipantMapper } from '../mappers/participant.mapper';
import { ParticipantApi } from '../sources/participant.api';

@Injectable({
    providedIn: 'root',
})
export class ParticipantRepositoryImpl extends ParticipantRepository {
    constructor(
        private readonly participantApi: ParticipantApi,
        private readonly participantMapper: ParticipantMapper
    ) {
        super();
    }

    fetchParticipants(filter: ParticipantFilter): Observable<Participant[]> {
        return this.participantApi
            .fetchParticipants(filter.toDto())
            .pipe(map((response) => this.participantMapper.mapFromDto(response)));
    }

    storeParticipant(
        payload: ParticipantStoreRequestDto
    ): Observable<Participant> {
        return this.participantApi.storeParticipant(payload).pipe(
            map((response) => {
                if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                    return this.participantMapper.mapItemFromDto(response.data[0]);
                }
                throw new Error('Invalid response from store participant');
            })
        );
    }

    updateParticipant(
        payload: ParticipantUpdateRequestDto
    ): Observable<Participant> {
        return this.participantApi.updateParticipant(payload).pipe(
            map((response) => {
                if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                    return this.participantMapper.mapItemFromDto(response.data[0]);
                }
                throw new Error('Invalid response from update participant');
            })
        );
    }

    deleteParticipant(
        id: string
    ): Observable<ParticipantDeleteResponseDto> {
        return this.participantApi.deleteParticipant(id);
    }

    enableParticipant(
        id: string
    ): Observable<ParticipantEnableResponseDto> {
        return this.participantApi.enableParticipant(id);
    }

    disableParticipant(
        id: string
    ): Observable<ParticipantDisableResponseDto> {
        return this.participantApi.disableParticipant(id);
    }

    getRoles(): Observable<RoleDto[]> {
        return this.participantApi.getRoles().pipe(
            map((response) => response.data || [])
        );
    }
}

