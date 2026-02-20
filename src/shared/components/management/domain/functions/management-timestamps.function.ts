import { MANAGEMENT_TIMESTAMP } from '@shared/components/management/domain/constants/management-timestamps.constant';
import { ManagementTimestamp } from '@shared/components/management/domain/interfaces/management-timestamps.interface';
import { ManagementTimestampKey } from '@shared/components/management/domain/types/management-timestamps.type';

import { DetailsStatus as finalizationStatus } from '@presentation/pages/finalization/domain/enums/details/details-status/details-status.enum';
import { DetailsProps as finalizationProps } from '@presentation/pages/finalization/domain/interfaces/details/details-props.interface';
import { DetailsProps as processingProps } from '@presentation/pages/processing/domain/interfaces/details/details-props.interface';
import { Status } from '@presentation/pages/requests/domain/enums/details/details-status/details-status.enum';
import { DetailsProps as requestsProps } from '@presentation/pages/requests/domain/interfaces/details/details-props.interface';

export function managementWorkflowTimestamps(
    props: processingProps | requestsProps | finalizationProps
): ManagementTimestamp[] {
    return MANAGEMENT_TIMESTAMP.map((step) => {
        let timestamp: string | null = null;
        const treater = props.treater;

        if (!treater) {
            return { ...step, timestamp };
        }

        if (step.key === 'approvedAt' && step.key1) {
            switch (props.status) {
                case Status.APPROVED:
                    timestamp = treater[step.key];
                    break;
                case Status.REJECTED:
                    timestamp = treater[step.key1];
                    break;
                default: {
                    const keys: ManagementTimestampKey[] = [
                        step.key,
                        step.key1,
                    ];
                    for (const key of keys) {
                        if (key && treater[key]) {
                            timestamp = treater[key];
                            break;
                        }
                    }
                }
            }
        } else if (step.key === 'confirmedAt' && step.key1 && step.key2) {
            switch (props.status) {
                case Status.CONFIRMED:
                    timestamp = treater[step.key];
                    break;
                case Status.ABANDONED:
                    timestamp = treater[step.key1];
                    break;
                case finalizationStatus.FINALIZATION:
                    timestamp = treater[step.key2];
                    break;
                default: {
                    const keys: ManagementTimestampKey[] = [
                        step.key,
                        step.key1,
                    ];
                    for (const key of keys) {
                        if (key && treater[key]) {
                            timestamp = treater[key];
                            break;
                        }
                    }
                }
            }
        } else {
            timestamp = treater[step.key];
        }

        return { ...step, timestamp };
    });
}
