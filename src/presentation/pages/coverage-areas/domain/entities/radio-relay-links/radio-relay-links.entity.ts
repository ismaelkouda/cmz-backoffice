import { RadioRelayLinksOperator } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-operator.enum';
import { RadioRelayLinksFrequency } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-frequency.enum';
import { RadioRelayLinksStatus } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-status.enum';
import { RadioRelayLinksStatusStyle } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-status.enum';
import { RadioRelayLinksProps } from '@pages/coverage-areas/domain/interfaces/radio-relay-links/radio-relay-links-props.interface';

export class RadioRelayLinksEntity {
    constructor(private readonly props: RadioRelayLinksProps) {}

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

    get actionsRef(): string {
        return this.props.name;
    }

    statusStyle(): string {
        const methodMap: Record<RadioRelayLinksStatus, string> = {
            [RadioRelayLinksStatus.ACTIVE]: RadioRelayLinksStatusStyle.ACTIVE,
            [RadioRelayLinksStatus.INACTIVE]:
                RadioRelayLinksStatusStyle.INACTIVE,
        };
        return methodMap[this.status];
    }

    with(props: RadioRelayLinksProps): RadioRelayLinksEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new RadioRelayLinksEntity(props);
    }
}
