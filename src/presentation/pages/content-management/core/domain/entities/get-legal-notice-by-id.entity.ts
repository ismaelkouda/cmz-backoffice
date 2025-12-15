export class GetLegalNoticeByIdEntity {
    constructor(
        public readonly content: string,
    ) { }

    public clone(updates: Partial<GetLegalNoticeByIdEntity>): GetLegalNoticeByIdEntity {
        return new GetLegalNoticeByIdEntity(
            updates.content ?? this.content,
        );
    }
}
