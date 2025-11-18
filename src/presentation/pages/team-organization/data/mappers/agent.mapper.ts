import { Injectable } from '@angular/core';
import { AgentIa } from '../../domain/entities/agent-ia.entity';
import {
    AgentItemDto,
    AgentResponseDto,
} from '../dtos/agent-response.dto';

@Injectable({
    providedIn: 'root',
})
export class AgentMapper {
    mapItemFromDto(dto: AgentItemDto): AgentIa {
        return {
            id: dto.id,
            code: dto.code,
            nom: dto.nom,
            description: dto.description,
            statut: dto.statut,
            senior_id: dto.senior_id,
            tenants_count: dto.tenants_count,
            created_at: dto.created_at,
            updated_at: dto.updated_at,
        };
    }

    mapArrayFromDto(dtos: AgentItemDto[]): AgentIa[] {
        return dtos.map((dto) => this.mapItemFromDto(dto));
    }

    mapFromDto(dto: AgentResponseDto): AgentIa[] {
        if (!dto.data || !Array.isArray(dto.data)) {
            return [];
        }
        return this.mapArrayFromDto(dto.data);
    }
}

