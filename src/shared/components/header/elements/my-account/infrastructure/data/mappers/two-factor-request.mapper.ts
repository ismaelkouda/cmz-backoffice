import { TwoFactorRequestEntity } from '../../../domain/entities/two-factor-request.entity';
import { TwoFactorRequestApiDto } from '../../api/dto/two-factor-request-api.dto';

export function twoFactorRequestMapper(
    entity: TwoFactorRequestEntity
): TwoFactorRequestApiDto {
    return { channel: entity.props.channel };
}
