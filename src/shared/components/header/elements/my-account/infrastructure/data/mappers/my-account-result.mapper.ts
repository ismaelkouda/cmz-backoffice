// import { Injectable } from '@angular/core';
// import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
// import { MapperUtils } from '@shared/domain/utils/mapper-utils';

// import { MyAccountResultEntity } from '../../../domain/entities/my-account-result.entity';
// import { MyAccountResultApiDto } from '../../api/dto/my-account-result-api.dto';

// @Injectable({ providedIn: 'root' })
// export class MyAccountResultMapper extends SimpleResponseMapper<
//     MyAccountResultEntity,
//     MyAccountResultApiDto
// > {
//     private readonly entityCache = new Map<string, MyAccountResultEntity>();

//     protected override mapItemFromDto(
//         dto: MyAccountResultApiDto
//     ): MyAccountResultEntity {
//         MapperUtils.validateDto(dto, {
//             required: ['action', 'message', 'success', 'processed_at'],
//         });

//         const entity: MyAccountResultEntity = {
//             action: dto.action,
//             enabled2fa: dto.enabled_2fa ?? null,
//             message: dto.message,
//             processedAt: dto.processed_at,
//             success: dto.success,
//         };

//         const cacheKey = `${dto.action}:${dto.processed_at}`;
//         this.entityCache.set(cacheKey, entity);
//         return this.entityCache.get(cacheKey) ?? entity;
//     }
// }
