import { Injectable } from '@angular/core';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';

import { TwoFactorRequestResultApiDto } from '../../api/dto/two-factor-request-result-api.dto';
import { TwoFactorRequestResultEntity } from '../../../domain/entities/two-factor-request-result.entity';

@Injectable({ providedIn: 'root' })
export class TwoFactorRequestResultMapper extends SimpleResponseMapper<
    TwoFactorRequestResultEntity,
    TwoFactorRequestResultApiDto
> {
    protected override mapItemFromDto(
        dto: TwoFactorRequestResultApiDto
    ): TwoFactorRequestResultEntity {
        const props = {
            channel: dto.channel,
            expiredAt: dto.expired_at,
            timeout: dto.timeout,
        };

        return new TwoFactorRequestResultEntity(props);
    }
}
