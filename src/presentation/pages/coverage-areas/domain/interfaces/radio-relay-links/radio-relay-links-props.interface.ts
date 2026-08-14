import { RadioRelayLinksOperator } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-operator.enum';
import { RadioRelayLinksFrequency } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-frequency.enum';
import { RadioRelayLinksStatus } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-status.enum';

export interface RadioRelayLinksProps {
    uniqId: string;
    name: string;
    operator: RadioRelayLinksOperator;
    frequency: RadioRelayLinksFrequency;
    startDate: Date;
    endDate: Date;
    status: RadioRelayLinksStatus;
    updatedAt: Date;
}

export interface RadioRelayLinksFindOneProps {
    uniqId: string;
    name: string;
    operator: RadioRelayLinksOperator;
    frequency: RadioRelayLinksFrequency;
    longitudePointA?: string;
    latitudePointA?: string;
    longitudePointB?: string;
    latitudePointB?: string;
    status: RadioRelayLinksStatus;
    updatedAt: Date;
    geomUrl?: string;
    geom?: any;
}
