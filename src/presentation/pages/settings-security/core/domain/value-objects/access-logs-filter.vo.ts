import { AccessLogsFilterDto } from "../../application/dtos/access-logs-filter.dtos";

export class AccessLogsFilterVo {
    constructor(
        public readonly search?: string,
        public readonly action?: string,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) { }

    static create(dto: AccessLogsFilterDto | null = {} as AccessLogsFilterDto): AccessLogsFilterVo {
        if (dto?.startDate && dto.endDate) {
            if (new Date(dto.startDate) > new Date(dto.endDate)) {
                throw new Error('Invalid date range');
            }
        }
        return new AccessLogsFilterVo(
            dto?.search,
            dto?.action,
            dto?.startDate,
            dto?.endDate
        );
    }
}