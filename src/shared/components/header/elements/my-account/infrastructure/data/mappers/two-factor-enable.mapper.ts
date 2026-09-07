import { TwoFactorEnableEntity } from '../../../domain/entities/two-factor-enable.entity';
import { TwoFactorEnableApiDto } from '../../api/dto/two-factor-enable-api.dto';

export function twoFactorEnableMapper(
    entity: TwoFactorEnableEntity
): TwoFactorEnableApiDto {
    return {
        otp: entity.props.otp,
        channel: entity.props.channel,
    };
}
