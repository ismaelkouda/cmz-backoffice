import { ActionDropdown } from "@shared/domain/enums/action-dropdown.enum";

export class TermsUseEntity {
    constructor(
        public readonly uniqId: string,
        public readonly name: string,
        public readonly content: string,
        public readonly version: string,
        public readonly status: ActionDropdown,
        public readonly createdAt: string,
        public readonly updatedAt: string
    ) { }

    public clone(updates: Partial<TermsUseEntity>): TermsUseEntity {
        return new TermsUseEntity(
            updates.uniqId ?? this.uniqId,
            updates.name ?? this.name,
            updates.content ?? this.content,
            updates.version ?? this.version,
            updates.status ?? this.status,
            updates.createdAt ?? this.createdAt,
            updates.updatedAt ?? this.updatedAt
        );
    }
}
