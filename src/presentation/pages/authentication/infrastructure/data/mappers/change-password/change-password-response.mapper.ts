import { Injectable } from '@angular/core';
import { ApiError } from '@shared/domain/errors/api.error';
import { ChangePasswordResponseApiDto } from '@presentation/pages/authentication/infrastructure/api/dto/change-password/change-password-response-api.dto';
import { ChangePasswordResponseEntity } from '@presentation/pages/authentication/domain/entities/change-password/change-password-response.entity';

@Injectable({ providedIn: 'root' })
export class ChangePasswordResponseMapper {
    mapFromDto(
        dto: ChangePasswordResponseApiDto
    ): ChangePasswordResponseEntity {
        if (dto.error || !dto.message) {
            throw ApiError.invalidResponse('Erreur API: La requête a échoué.');
        }

        return new ChangePasswordResponseEntity(dto.message);
    }
}
