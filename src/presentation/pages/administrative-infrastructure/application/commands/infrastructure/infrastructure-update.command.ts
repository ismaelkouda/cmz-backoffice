import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';

export class InfrastructureUpdateCommand {
    constructor(
        public readonly uniqId: string,
        public readonly name?: string,
        public readonly type?: string,
        public readonly position?: Coordinates,
        public readonly description?: string
    ) {}
}
