import { RadioRelayLinksFrequency } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-frequency.enum';
import { RadioRelayLinksOperator } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-operator.enum';

export interface RadioRelayLinksFilterDto {
    search?: string;
    operator?: RadioRelayLinksOperator;
    frequency?: RadioRelayLinksFrequency;
    startDate?: Date;
    endDate?: Date;
}
