import { AccessLogsFilterVo } from "@presentation/pages/settings-security/core/domain/value-objects/access-logs-filter.vo";
import { AccessLogsFilterApiDto } from "@presentation/pages/settings-security/infrastructure/api/dtos/access-logs/access-logs-filter-api.dto";

export class AccessLogsFilterMapper {
    static toApiDto(vo: AccessLogsFilterVo): AccessLogsFilterApiDto {
        const params: AccessLogsFilterApiDto = {} as AccessLogsFilterApiDto;

        if (vo.search) params.search = vo.search;
        if (vo.action) params.action = vo.action;
        if (vo.startDate) params.start_date = vo.startDate;
        if (vo.endDate) params.end_date = vo.endDate;

        return params;
    }
}