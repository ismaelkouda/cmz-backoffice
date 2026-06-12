import { DetailsProps as finalizationProps } from '@pages/finalization/domain/interfaces/details/details-props.interface';
import { DetailsProps as processingProps } from '@pages/processing/domain/interfaces/details/details-props.interface';
import { DetailsProps as requestsProps } from '@pages/requests/domain/interfaces/details/details-props.interface';
import { Status as requestsStatus } from '@pages/requests/domain/enums/details/details-status/details-status.enum';
import { MANAGEMENT_TIMESTAMP } from '@shared/components/management/domain/constants/management-timestamps.constant';
import { ManagementTimestamp } from '@shared/components/management/domain/interfaces/management-timestamps.interface';
import { ManagementTimestampKey } from '../types/management-timestamps.type';

export function managementWorkflowTimestamps(
    props: processingProps | requestsProps | finalizationProps
): ManagementTimestamp[] {
    return MANAGEMENT_TIMESTAMP.map((step) => {
        let timestamp: string | null = null;
        const treater = props.treater;

        if (!treater) {
            return { ...step, timestamp };
        }
        timestamp = treater[step.key];

        if (step.key === 'approvedAt' && step.key1) {
            switch (props.status) {
                case requestsStatus.APPROVED:
                    timestamp = treater[step.key];
                    break;
                case requestsStatus.REJECTED:
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
        } else {
            timestamp = treater[step.key];
        }
        return { ...step, timestamp };
    });
}
