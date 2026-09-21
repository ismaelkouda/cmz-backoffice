import { RadioRelayLinksOperator } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-operator.enum';

export interface RadioRelayLinksUpdateContract {
    uniqId?: string;
    name?: string;
    operator?: RadioRelayLinksOperator;
    frequency?: number;
    debit?: number;
    longitudePointA?: string;
    latitudePointA?: string;
    longitudePointB?: string;
    latitudePointB?: string;
    geomFile?: File;
}
