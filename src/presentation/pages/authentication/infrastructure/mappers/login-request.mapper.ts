import { LoginRequestEntity } from '../../domain/entities/login-request.entity';
import { LoginRequestApiDto } from '../dto/login-request-api.dto';

export function loginRequestMapper(
    entity: LoginRequestEntity
): LoginRequestApiDto {
    return {
        email: entity.props.email,
        password: entity.props.password,
    };
}
