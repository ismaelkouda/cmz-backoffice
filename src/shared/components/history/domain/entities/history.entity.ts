import { HistoryItemApiDto } from '@shared/components/history/infrastructure/api/dto/history-response.api.dto';

export class HistoryEntity {
    constructor(
        public readonly uniqId: string,
        public readonly actionType: string,
        public readonly action: string,
        public readonly source: string,
        public readonly createdAt: string,
        public readonly updatedAt: string
    ) {}

    static fromDto(dto: HistoryItemApiDto): HistoryEntity {
        return new HistoryEntity(
            dto.id,
            dto.action_type,
            dto.action,
            dto.source,
            dto.created_at,
            dto.updated_at
        );
    }

    public with(dto: HistoryItemApiDto): HistoryEntity {
        if (
            this.createdAt === dto.created_at &&
            this.updatedAt === dto.updated_at
        ) {
            return this;
        }
        return HistoryEntity.fromDto(dto);
    }
}
