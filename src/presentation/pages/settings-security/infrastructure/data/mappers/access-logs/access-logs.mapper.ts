import { AccessLogsEntity } from "@presentation/pages/settings-security/core/domain/entities/access-logs/access-logs.entity";
import { AccessLogsItemApiDto } from "@presentation/pages/settings-security/infrastructure/api/dtos/access-logs/access-logs-response-api.dto";
import { PaginatedMapper } from "@shared/data/mappers/base/paginated-response.mapper";
import { MapperUtils } from "@shared/utils/utils/mappers/mapper-utils";

export class AccessLogsMapper extends PaginatedMapper<AccessLogsEntity, AccessLogsItemApiDto> {
    private readonly entityCache = new Map<string, AccessLogsEntity>();

    protected mapItemFromDto(dto: AccessLogsItemApiDto): AccessLogsEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(dto) : AccessLogsEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}