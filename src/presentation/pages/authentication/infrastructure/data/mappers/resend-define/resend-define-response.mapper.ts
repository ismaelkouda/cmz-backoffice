import { Injectable } from '@angular/core';
import { ApiError } from '@shared/domain/errors/api.error';
import { ResendDefineResponseApiDto } from '@presentation/pages/authentication/infrastructure/api/dto/resend-define/resend-define-response-api.dto';
import { ResendDefineResponseEntity } from '@presentation/pages/authentication/domain/entities/resend-define/resend-define-response.entity';

@Injectable({ providedIn: 'root' })
export class ResendDefineResponseMapper {
    mapFromDto(dto: ResendDefineResponseApiDto): ResendDefineResponseEntity {
        if (dto.error || !dto.message) {
            throw ApiError.invalidResponse('Erreur API: La requête a échoué.');
        }

        return new ResendDefineResponseEntity(dto.message);
    }
}
