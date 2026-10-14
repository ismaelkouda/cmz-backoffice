interface AdministrativeBoundary {
    readonly id: number;
    readonly name: string;
    readonly code: string;
}

export class AdministrativeBoundaryEntity implements AdministrativeBoundary {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly code: string
    ) {}
}
