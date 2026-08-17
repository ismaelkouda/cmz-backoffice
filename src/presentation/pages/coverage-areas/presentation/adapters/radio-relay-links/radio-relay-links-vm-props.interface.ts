import { ActionDropdownItem } from '@shared/components/action-dropdown/interfaces/action-dropdown.interface';
import { RadioRelayLinksStatus } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-status.enum';
import { RadioRelayLinksOperator } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-operator.enum';
import { RadioRelayLinksFrequency } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-frequency.enum';

export interface RadioRelayLinksVmProps {
    uniqId: string;
    name: string;
    operator: RadioRelayLinksOperator;
    frequency: RadioRelayLinksFrequency;
    startDate: Date;
    endDate: Date;
    status: RadioRelayLinksStatus;
    statusLabel: string;
    statusStyle: string;
    updatedAt: Date;
    actionsRef: string;
    dropdownActions: ActionDropdownItem[];
    disableDropdown: boolean;
    tooltipDropdown: string;
}
