import { SlaFilterProps } from '@pages/sla/domain/interfaces/sla/sla-filter-props.interface';
import { SlaFilterEntity } from '@pages/sla/domain/entities/sla/sla-filter.entity';
import { SlaFilterDto } from '@pages/sla/application/dto/sla/sla-filter.dto';

export const slaFilterVo = (props: SlaFilterProps): SlaFilterEntity => {
    return new SlaFilterEntity(props);
};

export const slaFilterVoFromDto = (
    filterDto: SlaFilterDto | null
): SlaFilterEntity => {
    if (!filterDto) {
        return new SlaFilterEntity({});
    }
    return new SlaFilterEntity({
        search: filterDto.search,
    });
};
