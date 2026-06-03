import { LoginRequestEntity } from '@presentation/pages/authentication/domain/entities/login-request.entity';
import { LoginRequestApiDto } from '@presentation/pages/authentication/infrastructure/dto/login-request-api.dto';

export function loginRequestMapper(
    entity: LoginRequestEntity
): LoginRequestApiDto {
    return {
        email: entity.props.email,
        password: entity.props.password,
    };
}
