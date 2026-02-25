export class GetLegalNoticeByIdEntity {
    constructor(
        public readonly content: string,
        public readonly version: string
    ) {}

    public clone(
        updates: Partial<GetLegalNoticeByIdEntity>
    ): GetLegalNoticeByIdEntity {
        return new GetLegalNoticeByIdEntity(
            updates.content ?? this.content,
            updates.version ?? this.version
        );
    }
}
