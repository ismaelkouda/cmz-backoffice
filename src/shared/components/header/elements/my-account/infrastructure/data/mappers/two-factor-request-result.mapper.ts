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
            message: dto.message,
            maskedRecipient: dto.masked_recipient,
            expiresInSeconds: dto.expires_in_seconds,
            issuedAt: dto.issued_at,
        };

        return new TwoFactorRequestResultEntity(props);
    }
}
