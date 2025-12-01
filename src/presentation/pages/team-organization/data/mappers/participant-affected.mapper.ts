import { Injectable } from '@angular/core';
import { Participant } from '../../domain/entities/participant.entity';
import {
    ParticipantAffectedItemDto,
    ParticipantAffectedResponseDto,
} from '../dtos/team-response.dto';

@Injectable({
    providedIn: 'root',
})
export class ParticipantAffectedMapper {
    mapItemFromDto(dto: ParticipantAffectedItemDto): Participant {
        return {
            id: dto.id,
            matricule: dto.matricule,
            nom: dto.nom,
            prenoms: dto.prenoms,
            username: dto.username,
            email: dto.email,
            contacts: dto.contacts,
            adresse: null,
            role: dto.role,
            statut: dto.statut,
            created_at: dto.created_at,
            updated_at: dto.updated_at,
        };
    }

    mapArrayFromDto(dtos: ParticipantAffectedItemDto[]): Participant[] {
        return dtos.map((dto) => this.mapItemFromDto(dto));
    }

    mapFromDto(dto: ParticipantAffectedResponseDto): Participant[] {
        if (!dto.data || !Array.isArray(dto.data)) {
            return [];
        }
        return this.mapArrayFromDto(dto.data);
    }
}
