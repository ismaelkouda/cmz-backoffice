import { Injectable } from '@angular/core';
import { ForgotPasswordResponseApiDto } from '@presentation/pages/authentication/infrastructure/dto/forgot-password/forgot-password-response-api.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { ForgotPasswordResponseEntity } from '@presentation/pages/authentication/domain/entities/forgot-password/forgot-password-response.entity';

@Injectable({ providedIn: 'root' })
export class ForgotPasswordResponseMapper extends SimpleResponseMapper<
    ForgotPasswordResponseEntity,
    ForgotPasswordResponseApiDto
> {
    protected mapItemFromDto(
        dto: ForgotPasswordResponseApiDto
    ): ForgotPasswordResponseEntity {
        const props = {
            message: dto.message,
            token: dto.token,
            user: dto.user,
        };

        return new ForgotPasswordResponseEntity(props);
    }
}
