import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';

export class InfrastructureCreateCommand {
    constructor(
        public readonly name?: string,
        public readonly type?: string,
        public readonly position?: Coordinates,
        public readonly description?: string
    ) {}
}
