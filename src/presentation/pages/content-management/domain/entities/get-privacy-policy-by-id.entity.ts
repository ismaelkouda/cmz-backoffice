export class GetPrivacyPolicyByIdEntity {
    constructor(
        public readonly content: string,
        public readonly version: string
    ) {}

    public clone(
        updates: Partial<GetPrivacyPolicyByIdEntity>
    ): GetPrivacyPolicyByIdEntity {
        return new GetPrivacyPolicyByIdEntity(
            updates.content ?? this.content,
            updates.version ?? this.version
        );
    }
}
