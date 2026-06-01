// import { Injectable } from '@angular/core';
// import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
// import { MapperUtils } from '@shared/domain/utils/mapper-utils';

// import { RequestTwoFactorEntity } from '../../../domain/entities/request-two-factor.entity';
// import { RequestTwoFactorApiDto } from '../../api/dto/two-factor-request-api.dto';

// @Injectable({ providedIn: 'root' })
// export class RequestTwoFactorMapper extends SimpleResponseMapper<
//     RequestTwoFactorEntity,
//     RequestTwoFactorApiDto
// > {
//     private readonly entityCache = new Map<string, RequestTwoFactorEntity>();

//     protected override mapItemFromDto(
//         dto: RequestTwoFactorApiDto
//     ): RequestTwoFactorEntity {
//         MapperUtils.validateDto(dto, {
//             required: [
//                 'expires_in_seconds',
//                 'issued_at',
//                 'masked_recipient',
//                 'message',
//             ],
//         });

//         const cacheKey = `${dto.delivery_channel}:${dto.masked_recipient}:${dto.issued_at}`;
//         const cached = this.entityCache.get(cacheKey);
//         if (cached) {
//             return cached;
//         }

//         const entity: RequestTwoFactorEntity = {
//             expiresInSeconds: dto.expires_in_seconds,
//             issuedAt: dto.issued_at,
//             maskedRecipient: dto.masked_recipient,
//             message: dto.message,
//         };

//         this.entityCache.set(cacheKey, entity);
//         return entity;
//     }
// }
