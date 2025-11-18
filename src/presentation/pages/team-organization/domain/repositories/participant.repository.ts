import {
  ParticipantDeleteResponseDto,
  ParticipantDisableResponseDto,
  ParticipantEnableResponseDto,
  ParticipantStoreRequestDto,
  ParticipantUpdateRequestDto,
  RoleDto,
} from '@presentation/pages/team-organization/data/dtos/participant-response.dto';
import { Observable } from 'rxjs';
import { Participant } from '../entities/participant.entity';
import { ParticipantFilter } from '../value-objects/participant-filter.vo';

export abstract class ParticipantRepository {
    abstract fetchParticipants(
        filter: ParticipantFilter
    ): Observable<Participant[]>;

    abstract storeParticipant(
        payload: ParticipantStoreRequestDto
    ): Observable<Participant>;

    abstract updateParticipant(
        payload: ParticipantUpdateRequestDto
    ): Observable<Participant>;

    abstract deleteParticipant(
        id: string
    ): Observable<ParticipantDeleteResponseDto>;

    abstract enableParticipant(
        id: string
    ): Observable<ParticipantEnableResponseDto>;

    abstract disableParticipant(
        id: string
    ): Observable<ParticipantDisableResponseDto>;

    abstract getRoles(): Observable<RoleDto[]>;
}

