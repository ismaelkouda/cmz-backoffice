// import { Injectable } from '@angular/core';

// import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
// import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';

// import { AgentsPerformancesFindOneEntity } from '@presentation/pages/team-organization/domain/entities/agents-performances/agents-performances-find-one.entity';

// @Injectable({ providedIn: 'root' })
// export class AgentsPerformancesFindOneMapper extends SimpleResponseMapper<
//     AgentsPerformancesFindOneEntity,
//     AgentsPerformancesFindOneItemApiDto
// > {
//     private readonly entityCache = new Map<
//         string,
//         AgentsPerformancesFindOneEntity
//     >();

//     protected mapItemFromDto(
//         dto: AgentsPerformancesFindOneItemApiDto
//     ): AgentsPerformancesFindOneEntity {
//         MapperUtils.validateDto(dto, { required: ['id'] });

//         const props: ParticipantsFindOneProps = {
//             uniqId: dto.id,
//             reportType: dto.report_type,
//             operators: dto.operators,
//             source: dto.source,
//             initiatorPhoneNumber: dto.initiator,
//             updatedAt: dto.updated_at,
//         };

//         const cacheKey = `dto:${dto.id}`;
//         const cached = this.entityCache.get(cacheKey);

//         const entity = cached
//             ? cached.with(props)
//             : new AgentsPerformancesFindOneEntity(props);

//         this.entityCache.set(cacheKey, entity);
//         return entity;
//     }
// }
