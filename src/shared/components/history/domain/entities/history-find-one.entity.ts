import { HistoryFindOneItemApiDto } from '@shared/components/history/infrastructure/api/dto/history-findone-response-api.dto';

export class HistoryFindOneEntity {
    constructor(
        public readonly uniqId: string,
        public readonly user: string,
        public readonly addressIp: string,
        public readonly action: string,
        public readonly module: string,
        public readonly usedAgent: string,
        public readonly createdAt: string,
        public readonly data: { key: string; value: string }[]
    ) {}

    static fromDto(dto: HistoryFindOneItemApiDto): HistoryFindOneEntity {
        return new HistoryFindOneEntity(
            dto.id,
            dto.user,
            dto.address_ip,
            dto.action,
            dto.module,
            dto.used_agent,
            dto.created_at,
            dto.data ?? []
        );
    }

    public with(dto: HistoryFindOneItemApiDto): HistoryFindOneEntity {
        if (this.uniqId === dto.id) {
            return this;
        }
        return HistoryFindOneEntity.fromDto(dto);
    }
}
