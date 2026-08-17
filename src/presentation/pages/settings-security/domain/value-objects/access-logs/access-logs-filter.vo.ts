import { AccessLogsFilterDto } from '@pages/settings-security/application/dto/access-logs/access-logs-filter.dto';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';
import { AccessLogsFilterProps } from '../../interfaces/access-logs-filter.props';
import { AccessLogsActions } from '../../enums/access-logs/access-logs-actions.enum';

export class AccessLogsFilterVo {
    private constructor(private readonly props: AccessLogsFilterProps) {}

    get search(): string | undefined {
        return this.props.search;
    }

    get action(): AccessLogsActions | undefined {
        return this.props.action;
    }

    get period(): DatePeriod | undefined {
        return this.props.period;
    }

    static fromDto(dto: AccessLogsFilterDto): AccessLogsFilterVo {
        const normalizedSearch = dto.search?.trim();

        const search =
            normalizedSearch && normalizedSearch.length > 0
                ? normalizedSearch
                : undefined;

        const period =
            dto.startDate || dto.endDate
                ? DatePeriod.create(dto.startDate, dto.endDate)
                : undefined;

        return new AccessLogsFilterVo({ search, action: dto.action, period });
    }
}
