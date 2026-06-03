import { Injectable } from '@angular/core';
import { ResetPasswordResponseApiDto } from '@presentation/pages/authentication/infrastructure/dto/reset-password/reset-password-response-api.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { ResetPasswordResponseEntity } from '@presentation/pages/authentication/domain/entities/reset-password/reset-password-response.entity';

@Injectable({ providedIn: 'root' })
export class ResetPasswordResponseMapper extends SimpleResponseMapper<
    ResetPasswordResponseEntity,
    ResetPasswordResponseApiDto
> {
    protected mapItemFromDto(
        dto: ResetPasswordResponseApiDto
    ): ResetPasswordResponseEntity {
        const props = {
            message: dto.message,
            token: dto.token,
            user: dto.user,
        };

        return new ResetPasswordResponseEntity(props);
    }
}
