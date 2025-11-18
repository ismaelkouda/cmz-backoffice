import { Injectable } from '@angular/core';
import { Team } from '../../domain/entities/team.entity';
import {
  TeamItemDto,
  TeamResponseDto,
} from '../dtos/team-response.dto';

@Injectable({
    providedIn: 'root',
})
export class TeamMapper {
    mapItemFromDto(dto: TeamItemDto): Team {
        return {
            id: dto.id,
            code: dto.code,
            nom: dto.nom,
            description: dto.description,
            statut: dto.statut,
            tenants_count: dto.tenants_count,
            agents_count: dto.agents_count,
            created_at: dto.created_at,
            updated_at: dto.updated_at,
        };
    }

    mapArrayFromDto(dtos: TeamItemDto[]): Team[] {
        return dtos.map((dto) => this.mapItemFromDto(dto));
    }

    mapFromDto(dto: TeamResponseDto): Team[] {
        if (!dto.data || !Array.isArray(dto.data)) {
            return [];
        }
        return this.mapArrayFromDto(dto.data);
    }
}

