
export class MunicipalitiesSelectEntity {
    constructor(
        public readonly name: string,
        public readonly code: string,
    ) { }

    public clone(updates: Partial<MunicipalitiesSelectEntity>): MunicipalitiesSelectEntity {
        return new MunicipalitiesSelectEntity(
            updates.name ?? this.name,
            updates.code ?? this.code,
        );
    }
}
