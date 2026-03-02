// import { Injectable } from '@angular/core';

// import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
// import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';

// import { TeamsFreeParticipantsEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-free-participants.entity';
// import { TeamsFreeParticipantsItemApiDto } from '@presentation/pages/team-organization/infrastructure/api/dto/teams/teams-free-participants-response-api.dto';

// @Injectable({
//     providedIn: 'root',
// })
// export class TeamsFreeParticipantsMapper extends PaginatedMapper<
//     TeamsFreeParticipantsEntity,
//     TeamsFreeParticipantsItemApiDto
// > {
//     private readonly entityCache = new Map<
//         string,
//         TeamsFreeParticipantsEntity
//     >();

//     protected mapItemFromDto(
//         dto: TeamsFreeParticipantsItemApiDto
//     ): TeamsFreeParticipantsEntity {
//         MapperUtils.validateDto(dto, { required: ['uniq_id'] });
//         const cacheKey = `dto:${dto.uniq_id}`;
//         const cached = this.entityCache.get(cacheKey);

//         const entity = cached
//             ? cached.with(dto)
//             : TeamsFreeParticipantsEntity.fromDto(dto);

//         this.entityCache.set(cacheKey, entity);
//         return entity;
//     }
// }
