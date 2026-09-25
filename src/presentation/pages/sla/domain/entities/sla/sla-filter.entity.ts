import { SlaFilterProps } from '@pages/sla/domain/interfaces/sla/sla-filter-props.interface';
import { SlaFilterDto } from '@pages/sla/application/dto/sla/sla-filter.dto';

export class SlaFilterEntity implements SlaFilterProps {
    constructor(private readonly props: SlaFilterProps) {}

    get search(): string | undefined {
        return this.props.search;
    }

    static fromDto(filterDto: SlaFilterDto | null): SlaFilterEntity {
        if (!filterDto) {
            return new SlaFilterEntity({});
        }
        return new SlaFilterEntity({
            search: filterDto.search,
        });
    }
}
