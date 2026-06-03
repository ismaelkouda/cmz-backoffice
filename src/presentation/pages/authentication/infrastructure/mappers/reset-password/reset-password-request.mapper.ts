import { ResetPasswordRequestEntity } from '@presentation/pages/authentication/domain/entities/reset-password/reset-password-request.entity';
import { ResetPasswordRequestApiDto } from '@presentation/pages/authentication/infrastructure/dto/reset-password/reset-password-request-api.dto';

export function resetPasswordRequestMapper(
    entity: ResetPasswordRequestEntity
): ResetPasswordRequestApiDto {
    return {
        password: entity.props.password,
        confirmPassword: entity.props.confirmPassword,
    };
}
