import { PasswordChangeEntity } from '../../../domain/entities/password-change.entity';
import { PasswordChangeApiDto } from '../../api/dto/password-change-api.dto';

export function passwordChangeMapper(
    entity: PasswordChangeEntity
): PasswordChangeApiDto {
    return {
        old_password: entity.props.oldPassword,
        new_password: entity.props.newPassword,
        new_password_confirmation: entity.props.newPasswordConfirmation,
    };
}
