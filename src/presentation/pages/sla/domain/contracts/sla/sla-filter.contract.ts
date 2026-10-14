import { SlaFilterProps } from '@pages/sla/domain/interfaces/sla/sla-filter-props.interface';

export interface SlaFilterContract {
    search?: string;
    category?: string;
}

export const slaFilterContract = (
    props: SlaFilterProps
): SlaFilterContract => ({
    search: props.search,
    category: props.category,
});
