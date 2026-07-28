import { RadioRelayLinksOperator } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-operator.enum';

export interface RadioRelayLinksFilterContract {
    search?: string;
    operator?: RadioRelayLinksOperator;
    startDate?: Date;
    endDate?: Date;
}
