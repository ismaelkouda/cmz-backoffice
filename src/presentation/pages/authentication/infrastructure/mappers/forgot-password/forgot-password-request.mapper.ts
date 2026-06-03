import { ForgotPasswordRequestEntity } from '@presentation/pages/authentication/domain/entities/forgot-password/forgot-password-request.entity';
import { ForgotPasswordRequestApiDto } from '@presentation/pages/authentication/infrastructure/dto/forgot-password/forgot-password-request-api.dto';

export function forgotPasswordRequestMapper(
    entity: ForgotPasswordRequestEntity
): ForgotPasswordRequestApiDto {
    return {
        email: entity.props.email,
    };
}
