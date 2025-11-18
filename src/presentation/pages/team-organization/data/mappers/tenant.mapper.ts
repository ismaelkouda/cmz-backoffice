import { Injectable } from '@angular/core';
import { Tenant } from '../../domain/entities/tenant.entity';
import {
    TenantItemDto,
    TenantResponseDto,
} from '../dtos/team-response.dto';

@Injectable({
    providedIn: 'root',
})
export class TenantMapper {
    mapItemFromDto(dto: TenantItemDto): Tenant {
        return {
            id: dto.id,
            code: dto.code,
            nom_tenant: dto.nom_tenant,
            compte_client: dto.compte_client,
            segment_client: dto.segment_client,
            domaine_activite: dto.domaine_activite,
            statut: dto.statut,
            created_at: dto.created_at,
            updated_at: dto.updated_at,
        };
    }

    mapArrayFromDto(dtos: TenantItemDto[]): Tenant[] {
        return dtos.map((dto) => this.mapItemFromDto(dto));
    }

    mapFromDto(dto: TenantResponseDto): Tenant[] {
        if (!dto.data || !Array.isArray(dto.data)) {
            return [];
        }
        return this.mapArrayFromDto(dto.data);
    }
}

