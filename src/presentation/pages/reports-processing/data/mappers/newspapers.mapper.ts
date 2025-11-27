import { Injectable } from '@angular/core';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { NewspapersEntity } from '../../domain/entities/management/newspapers/newspapers.entity';
import { NewspapersItemDto } from '../dtos/management/newspapers/newspapers-response.dto';

@Injectable({ providedIn: 'root' })
export class NewspapersMapper extends PaginatedMapper<
    NewspapersEntity,
    NewspapersItemDto
> {
    protected override mapItemFromDto(
        dto: NewspapersItemDto
    ): NewspapersEntity {
        return new NewspapersEntity(
            dto.id,
            dto.uniq_id,
            dto.description,
            dto.date,
            dto.type,
            dto.createdAt,
            dto.updatedAt
        );
    }
}
