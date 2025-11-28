import { Injectable } from '@angular/core';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { ManagementEntity } from '../../domain/entities/management/management.entity';

@Injectable({ providedIn: 'root' })
export class ManagementMapper {
    mapFromDto(dto: SimpleResponseDto<ManagementEntity>): ManagementEntity {
        if (dto.error) {
            return {
                message: dto.message,
                error: dto.error,
            };
        }

        return {
            error: false,
            message: dto.message,
        };
    }
}
