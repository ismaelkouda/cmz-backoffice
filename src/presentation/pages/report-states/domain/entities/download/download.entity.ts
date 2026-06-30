import {
    Status,
    StatusStyle,
} from '@pages/report-states/domain/enums/download/download-status.enum';
import { DownloadProps } from '@pages/report-states/domain/interfaces/download/download-props.interface';
import { DownloadType } from '../../enums/download-type.enum';

export class DownloadEntity implements DownloadProps {
    constructor(private readonly props: DownloadProps) {}

    get actionsRef(): string {
        return this.props.uniqId;
    }

    get date(): string {
        return this.props.date;
    }

    get uniqId(): string {
        return this.props.uniqId;
    }

    get name(): string {
        return this.props.name;
    }

    get type(): DownloadType {
        return this.props.type;
    }

    get size(): number {
        return this.props.size;
    }

    get status(): Status {
        return this.props.status;
    }
    statusStyle(status: Status): StatusStyle {
        const methodMap: Record<Status, StatusStyle> = {
            [Status.PENDING]: StatusStyle.PENDING,
            [Status.PROCESSING]: StatusStyle.PROCESSING,
            [Status.DONE]: StatusStyle.DONE,
            [Status.FAILED]: StatusStyle.FAILED,
        };
        return methodMap[status];
    }

    get filter(): { name: string; value: string }[] {
        return this.props.filter;
    }

    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: DownloadProps): DownloadEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new DownloadEntity(props);
    }
}
