import { AccessLogsItemApiDto } from "@presentation/pages/settings-security/infrastructure/api/dtos/access-logs/access-logs-response-api.dto";

export class AccessLogsEntity {
    constructor(
        public readonly uniqId: string,
        public action: string,
        public source: string,
        public usedAgent: string,
        public createdAt: string
    ) { }

    static fromDto(dto: AccessLogsItemApiDto): AccessLogsEntity {
        return new AccessLogsEntity(
            dto.id,
            dto.action,
            dto.source,
            dto.used_agent,
            dto.created_at
        );
    }

    public with(dto: AccessLogsItemApiDto): AccessLogsEntity {
        if (this.createdAt === dto.created_at) {
            return this;
        }
        return AccessLogsEntity.fromDto(dto);
    }
}