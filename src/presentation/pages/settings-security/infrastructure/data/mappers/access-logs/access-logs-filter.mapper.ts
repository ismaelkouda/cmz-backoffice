import { inject, Injectable } from '@angular/core';
import { AccessLogsFilterEntity } from '@pages/settings-security/domain/entities/access-logs/access-logs-filter.entity';
import { AccessLogsFilterApiDto } from '@pages/settings-security/infrastructure/api/dto/access-logs/access-logs-filter-api.dto';
import { AccessLogsActionsMapper } from '@pages/settings-security/infrastructure/data/mappers/access-logs/access-logs-actions.mapper';

@Injectable({
    providedIn: 'root',
})
export class AccessLogsFilterMapper {
    private readonly actionsMapper = inject(AccessLogsActionsMapper);

    map(entity: AccessLogsFilterEntity): AccessLogsFilterApiDto {
        return {
            ...(entity.search && {
                search: entity.search,
            }),
            ...(entity.action && {
                action: this.actionsMapper.mapToDto(entity.action),
            }),
            ...(entity.period?.start && { start_date: entity.period.start }),
            ...(entity.period?.end && { end_date: entity.period.end }),
        };
    }
}
