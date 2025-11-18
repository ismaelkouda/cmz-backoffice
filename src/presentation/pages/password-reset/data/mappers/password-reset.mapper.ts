import { Injectable } from '@angular/core';
import { PasswordResetResponse } from '../../domain/entities/password-reset-response.entity';
import { PasswordResetResponseDto } from '../dtos/password-reset-response.dto';

@Injectable({ providedIn: 'root' })
export class PasswordResetMapper {
    mapFromDto(dto: PasswordResetResponseDto): PasswordResetResponse {
        if (dto.error) {
            throw new Error(
                dto.message || 'PASSWORD_RESET.MESSAGES.ERROR.FAILED'
            );
        }

        return {
            message: dto.message,
            success: dto.data?.success ?? true,
        };
    }
}

