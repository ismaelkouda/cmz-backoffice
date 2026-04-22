import { HistoryItemApiDto } from '@shared/components/history/infrastructure/api/dto/history-response.api.dto';

export class HistoryEntity {
    constructor(
        public readonly uniqId: string,
        public readonly actionType: string,
        public readonly action: string,
        public readonly source: string,
        public readonly createdAt: string
    ) {}

    static fromDto(dto: HistoryItemApiDto): HistoryEntity {
        const source = `${dto.ip_address} - [${dto.initiator.phone}] ${dto.initiator.last_name} ${dto.initiator.first_name}`;
        return new HistoryEntity(
            dto.id_model,
            dto.type_action,
            dto.action,
            source,
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
