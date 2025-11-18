import { Injectable } from '@angular/core';
import { Paginate } from '@shared/interfaces/paginate';
import { User } from '../../domain/entities/user.entity';
import { UserItemDto, UserResponseDto } from '../dtos/user-response.dto';
import { SimplePaginatedMapper } from './base/simple-paginated-mapper';

@Injectable({
    providedIn: 'root',
})
export class UserMapper extends SimplePaginatedMapper<
    User,
    UserItemDto,
    UserResponseDto
> {
    protected override mapItemFromDto(dto: UserItemDto): User {
        return {
            id: dto.id,
            matricule: dto.matricule,
            lastName: dto.lastName,
            firstName: dto.firstName,
            fullName: dto.fullName ?? `${dto.firstName} ${dto.lastName}`,
            email: dto.email,
            uniqId: dto.uniqId,
            profile: dto.profile,
            status: dto.status,
            created_at: dto.created_at,
            updated_at: dto.updated_at,
        };
    }

    override mapFromDto(dto: UserResponseDto): Paginate<User> {
        return super.mapFromDto(dto);
    }
}
