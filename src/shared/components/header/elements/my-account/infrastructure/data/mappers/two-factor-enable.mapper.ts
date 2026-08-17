import { TwoFactorEnableEntity } from '../../../domain/entities/two-factor-enable.entity';
import { TwoFactorEnableApiDto } from '../../api/dto/two-factor-enable-api.dto';

export function twoFactorEnableMapper(
    entity: TwoFactorEnableEntity
): TwoFactorEnableApiDto {
    return {
        user_id: entity.props.userId,
        email: entity.props.email,
        code: entity.props.code,
    };
}
