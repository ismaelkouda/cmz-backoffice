import { Injectable } from '@angular/core';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { UsersEntity } from '../../domain/entities/users/users.entity';
import { UserItemDto } from '../dtos/user-response.dto';

@Injectable({
    providedIn: 'root',
})
export class UserMapper extends PaginatedMapper<
    UsersEntity,
    UserItemDto
> {
    protected override mapItemFromDto(dto: UserItemDto): UsersEntity {
        return new UsersEntity(
            dto.id,
            dto.matricule,
            dto.lastName,
            dto.firstName,
            dto.email,
            dto.uniqId,
            dto.profile,
            dto.status,
            dto.created_at,
            dto.updated_at,
        );
    }
}
