import { AccessLogsFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/access-logs/access-logs-filter.entity';
import { AccessLogsFilterApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/access-logs/access-logs-filter-api.dto';

export function AccessLogsFilterMapper(
    vo: AccessLogsFilterEntity
): AccessLogsFilterApiDto {
    const params: AccessLogsFilterApiDto = {} as AccessLogsFilterApiDto;

    if (vo.search) {
        params.search = vo.search;
    }
    if (vo.action) {
        params.action = vo.action;
    }
    if (vo.period?.start) {
        params.start_date = vo.period.start;
    }
    if (vo.period?.end) {
        params.end_date = vo.period.end;
    }

    return params;
}
