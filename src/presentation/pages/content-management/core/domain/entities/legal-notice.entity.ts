import { ActionDropdown } from "@shared/domain/enums/action-dropdown.enum";

export class LegalNoticeEntity {
    constructor(
        public readonly uniqId: string,
        public readonly name: string,
        public readonly content: string,
        public readonly version: string,
        public readonly status: ActionDropdown,
        public readonly createdAt: string,
        public readonly publishedAt: string
    ) { }

    public clone(updates: Partial<LegalNoticeEntity>): LegalNoticeEntity {
        return new LegalNoticeEntity(
            updates.uniqId ?? this.uniqId,
            updates.name ?? this.name,
            updates.content ?? this.content,
            updates.version ?? this.version,
            updates.status ?? this.status,
            updates.createdAt ?? this.createdAt,
            updates.publishedAt ?? this.publishedAt
        );
    }
}
