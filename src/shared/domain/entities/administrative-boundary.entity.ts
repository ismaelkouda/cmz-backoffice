interface AdministrativeBoundary {
    readonly id: string;
    readonly name: string;
}

export class AdministrativeBoundaryEntity implements AdministrativeBoundary {
    constructor(
        public readonly id: string,
        public readonly name: string
    ) {}
}
