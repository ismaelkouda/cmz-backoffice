import { RadioRelayLinksFrequency } from '@presentation/pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-frequency.enum';
import { RadioRelayLinksOperator } from '@presentation/pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-operator.enum';

export interface RadioRelayLinksUpdateDto {
    uniqId?: string;
    name?: string;
    operator?: RadioRelayLinksOperator;
    frequency?: RadioRelayLinksFrequency;
}
