import { SlaFilterDto } from '@pages/sla/application/dto/sla/sla-filter.dto';

export class SlaQuery {
    constructor(public readonly search?: string) {}

    static fromDto(filter: SlaFilterDto | null): SlaQuery {
        return new SlaQuery(filter?.search);
    }
}
