import { Injectable } from '@angular/core';
import { LoginResponseApiDto } from '@pages/authentication/infrastructure/dto/login-response-api.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { LoginResponseEntity } from '@presentation/pages/authentication/domain/entities/login-response.entity';

@Injectable({ providedIn: 'root' })
export class LoginResponseMapper extends SimpleResponseMapper<
    LoginResponseEntity,
    LoginResponseApiDto
> {
    protected mapItemFromDto(dto: LoginResponseApiDto): LoginResponseEntity {
        const props = {
            message: dto.message,
            token: dto.token,
            user: dto.user,
        };

        return new LoginResponseEntity(props);
    }
}
