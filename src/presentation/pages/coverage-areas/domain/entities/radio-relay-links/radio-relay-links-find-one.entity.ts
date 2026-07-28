import { RadioRelayLinksFindOneProps } from '@pages/coverage-areas/domain/interfaces/radio-relay-links/radio-relay-links-props.interface';
import { RadioRelayLinksOperator } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-operator.enum';
import { RadioRelayLinksFrequency } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-frequency.enum';
import { RadioRelayLinksStatus } from '../../enums/radio-relay-links/radio-relay-links-status.enum';

export class RadioRelayLinksFindOneEntity {
    constructor(private readonly props: RadioRelayLinksFindOneProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }

    get name(): string {
        return this.props.name;
    }

    get operator(): RadioRelayLinksOperator {
        return this.props.operator;
    }

    get frequency(): RadioRelayLinksFrequency {
        return this.props.frequency;
    }

    get startDate(): Date {
        return this.props.startDate;
    }

    get endDate(): Date {
        return this.props.endDate;
    }

    get status(): RadioRelayLinksStatus {
        return this.props.status;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    get geomUrl(): string | undefined {
        return this.props.geomUrl;
    }

    get geom(): any {
        return this.props.geom;
    }

    with(props: RadioRelayLinksFindOneProps): RadioRelayLinksFindOneEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new RadioRelayLinksFindOneEntity(props);
    }
}
