export class GetTermsUseByIdEntity {
    constructor(
        public readonly content: string,
        public readonly version: string,
    ) { }

    public clone(updates: Partial<GetTermsUseByIdEntity>): GetTermsUseByIdEntity {
        return new GetTermsUseByIdEntity(
            updates.content ?? this.content,
            updates.version ?? this.version,
        );
    }
}
