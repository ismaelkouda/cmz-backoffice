import {
    Status,
    StatusStyle,
} from '@pages/report-states/domain/enums/download/download-status.enum';
import { DownloadProps } from '@pages/report-states/domain/interfaces/download/download-props.interface';
import { StatusMapper } from '@pages/report-states/infrastructure/data/mappers/download/download-status.mapper';
import { DownloadType } from '@pages/report-states/domain/enums/download-type.enum';

export class DownloadEntity implements DownloadProps {
    constructor(
        private readonly props: DownloadProps,
        private readonly statusMapper: StatusMapper
    ) {}

    get actionsRef(): string {
        return this.props.createdAt;
    }

    get uniqId(): string {
        return this.props.uniqId;
    }

    get url(): string {
        return this.props.url;
    }

    get name(): string {
        return this.props.name;
    }

    get size(): number {
        return this.props.size;
    }

    get type(): DownloadType {
        return this.props.type;
    }

    get status(): Status {
        return this.props.status;
    }
    statusStyle(status: Status): StatusStyle {
        return this.statusMapper.mapStatusToStyle(status);
    }

    get filters(): { name: string; value: string }[] {
        return this.props.filters;
    }

    get createdAt(): string {
        return this.props.createdAt;
    }

    public with(
        props: DownloadProps,
        statusMapper: StatusMapper
    ): DownloadEntity {
        // if (
        //     this.createdAt === props.createdAt &&
        //     this.uniqId === props.uniqId
        // ) {
        //     return this;
        // }
        return new DownloadEntity(props, statusMapper);
    }
}
