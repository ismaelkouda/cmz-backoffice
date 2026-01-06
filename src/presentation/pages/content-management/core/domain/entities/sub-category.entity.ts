export class SubCategoryEntity {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly icon: string | null,
        public readonly color: string,
        public readonly backgroundColor: string,
        public readonly description: string | null
    ) {}

    public clone(updates: Partial<SubCategoryEntity>): SubCategoryEntity {
        return new SubCategoryEntity(
            updates.id ?? this.id,
            updates.name ?? this.name,
            updates.icon ?? this.icon,
            updates.color ?? this.color,
            updates.backgroundColor ?? this.backgroundColor,
            updates.description ?? this.description
        );
    }
}
