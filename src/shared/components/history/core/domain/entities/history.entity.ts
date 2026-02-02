import { HistoryItemApiDto } from '@shared/components/history/infrastructure/api/dtos/history-response.api.dto';

export class HistoryEntity {
    constructor(
        public readonly uniqId: string,
        public readonly actionType: string,
        public readonly action: string,
        public readonly source: string,
        public readonly createdAt: string
    ) {}

    static fromDto(dto: HistoryItemApiDto): HistoryEntity {
        return new HistoryEntity(
            dto.id,
            dto.action_type,
            dto.action,
            dto.source,
            dto.created_at
        );
    }

    public with(dto: HistoryItemApiDto): HistoryEntity {
        if (this.createdAt === dto.created_at) {
            return this;
        }
        return HistoryEntity.fromDto(dto);
    }
}
