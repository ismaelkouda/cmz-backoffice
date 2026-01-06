/* import { Injectable } from '@angular/core';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { ProfileHabilitation } from '../../domain/entities/profile-habilitation.entity';
import {
    ProfileHabilitationItemDto,
    ProfileHabilitationResponseDto,
} from '../dtos/profile-habilitation-response.dto';

@Injectable({
    providedIn: 'root',
})
export class ProfileHabilitationMapper extends PaginatedMapper<
    ProfileHabilitation,
    ProfileHabilitationItemDto
> {
    protected override mapItemFromDto(
        dto: ProfileHabilitationItemDto
    ): ProfileHabilitation {
        return {
            id: dto.id,
            name: dto.name,
            description: dto.description,
            status: dto.status,
            totalUsers: dto.totalUsers ?? dto.users_count,
            createdAt: dto.createdAt ?? dto.created_at,
            updated_at: dto.updated_at,
        };
    }

    override mapFromDto(
        dto: ProfileHabilitationResponseDto
    ): Paginate<ProfileHabilitation> {
        return super.mapFromDto(dto);
    }
} */
