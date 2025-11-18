import { Injectable } from '@angular/core';
import { Participant } from '../../domain/entities/participant.entity';
import {
    ParticipantItemDto,
    ParticipantResponseDto,
} from '../dtos/participant-response.dto';

@Injectable({
    providedIn: 'root',
})
export class ParticipantMapper {
    mapItemFromDto(dto: ParticipantItemDto): Participant {
        return {
            id: dto.id,
            matricule: dto.matricule,
            nom: dto.nom,
            prenoms: dto.prenoms,
            username: dto.username,
            email: dto.email,
            contacts: dto.contacts,
            adresse: dto.adresse,
            role: dto.role,
            statut: dto.statut,
            created_at: dto.created_at,
            updated_at: dto.updated_at,
        };
    }

    mapArrayFromDto(dtos: ParticipantItemDto[]): Participant[] {
        return dtos.map((dto) => this.mapItemFromDto(dto));
    }

    mapFromDto(dto: ParticipantResponseDto): Participant[] {
        if (!dto.data || !Array.isArray(dto.data)) {
            return [];
        }
        return this.mapArrayFromDto(dto.data);
    }
}

