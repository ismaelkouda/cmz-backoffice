import { Injectable } from '@angular/core';
import { ApiError } from '@shared/domain/errors/api.error';
import { ResetPasswordResponseDto } from '@presentation/pages/authentication/infrastructure/api/dto/reset-password/reset-password-response-api.dto';
import { ResetPasswordResponseEntity } from '@presentation/pages/authentication/domain/entities/reset-password/reset-password-response.entity';

@Injectable({ providedIn: 'root' })
export class ResetPasswordResponseMapper {
    mapFromDto(dto: ResetPasswordResponseDto): ResetPasswordResponseEntity {
        if (dto.error) {
            throw ApiError.invalidResponse(
                dto.message || 'Erreur API: La requête a échoué.'
            );
        }

        return new ResetPasswordResponseEntity({
            message: dto.message,
            token: dto.data?.token,
            user: dto.data?.user,
        });
    }
}
