import { Injectable } from '@angular/core';
import {
    AgentsPerformancesFindOneEntity,
    AgentsPerformancesFindOneProps,
} from '@pages/team-organization/domain/entities/agents-performances/agents-performances-find-one.entity';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import { AgentsPerformancesFindOneItemApiDto } from '../../../api/dto/agents-performances/agents-performances-find-one-response-api.dto';

@Injectable({ providedIn: 'root' })
export class AgentsPerformancesFindOneMapper extends PaginatedMapper<
    AgentsPerformancesFindOneEntity,
    AgentsPerformancesFindOneItemApiDto
> {
    private readonly entityCache = new Map<
        string,
        AgentsPerformancesFindOneEntity
    >();

    protected mapItemFromDto(
        dto: AgentsPerformancesFindOneItemApiDto
    ): AgentsPerformancesFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['uniq_id'] });

        const props: AgentsPerformancesFindOneProps = {
            uniqId: dto.uniq_id,
            reportType: dto.report_type,
            operators: dto.operators,
            source: dto.source,
            initiatorPhoneNumber: dto.initiator_phone_number,
            createdAt: dto.created_at,
        };

        const cacheKey = `dto:${dto.uniq_id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new AgentsPerformancesFindOneEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
