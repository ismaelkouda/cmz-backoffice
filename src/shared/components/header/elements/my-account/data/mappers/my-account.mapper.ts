import { Injectable } from '@angular/core';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { LogoutEntity } from '../../domain/entities/logout.entity';

@Injectable({ providedIn: 'root' })
export class MyAccountMapper {
    mapFromDto(dto: SimpleResponseDto<any>): LogoutEntity {
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
