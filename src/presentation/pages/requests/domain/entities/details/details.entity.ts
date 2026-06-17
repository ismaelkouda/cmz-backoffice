import { DetailsQualificationState } from '@pages/requests/domain/enums/details/details-qualification-state/details-qualification-state.enum';
import {
    Status,
    StatusLabel,
    StatusStyle,
} from '@pages/requests/domain/enums/details/details-status/details-status.enum';
import { detailsLabelButtonSubmit } from '@pages/requests/domain/functions/details/details-label-button-submit.function';
import { detailsPermissionsApprove } from '@pages/requests/domain/functions/details/details-permissions-approve.function';
import { detailsPermissionsTake } from '@pages/requests/domain/functions/details/details-permissions-take.function';
import { detailsTitle } from '@pages/requests/domain/functions/details/details-title.function';
import { DetailsProps } from '@pages/requests/domain/interfaces/details/details-props.interface';
import { DetailsTreaterInfo } from '@pages/requests/domain/types/details/details-treater-info.type';
import { managementWorkflowTimestamps } from '@shared/components/management/domain/functions/management-timestamps.function';
import { ManagementTimestamp } from '@shared/components/management/domain/interfaces/management-timestamps.interface';
import { TelecomOperatorDto } from '@shared/data/dto/telecom-operator.dto';
import { ActorEntity } from '@shared/domain/entities/actor.entity';
import { AdministrativeBoundaryEntity } from '@shared/domain/entities/administrative-boundary.entity';
import { ReportLocationEntity } from '@shared/domain/entities/report-location.entity';
import { ReportMediaEntity } from '@shared/domain/entities/report-media.entity';
import { TimestampsEntity } from '@shared/domain/entities/timestamps.entity';
import {
    LocationMethod,
    LocationMethodStyle,
} from '@shared/domain/enums/location-method.enum';
import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';

export interface DetailsContext {
    props: DetailsProps;
    permissions: {
        canTake: boolean;
        canQualify: boolean;
    };
}

export interface DetailsRule {
    name: string;
    when: (ctx: DetailsContext) => boolean;
    title: string;
}
export class DetailsEntity {
    constructor(
        private readonly props: DetailsProps,
        private readonly permissions: {
            canTake: boolean;
            canQualify: boolean;
        }
    ) {}

    get type(): string {
        return this.props.type;
    }

    get uniqId(): string {
        return this.props.uniqId;
    }

    get reportUniqId(): string {
        return this.props.reportUniqId;
    }

    get initiatorPhone(): string {
        return this.props.initiatorPhone;
    }

    get initiator(): ActorEntity | null {
        return this.props.initiator;
    }

    get acknowledgedBy(): ActorEntity | null {
        return this.props.acknowledgedBy;
    }

    get processedBy(): ActorEntity | null {
        return this.props.processedBy;
    }

    get finalizedBy(): ActorEntity | null {
        return this.props.finalizedBy;
    }

    get approvedBy(): ActorEntity | null {
        return this.props.approvedBy;
    }

    get rejectedBy(): ActorEntity | null {
        return this.props.rejectedBy;
    }

    get confirmedBy(): ActorEntity | null {
        return this.props.confirmedBy;
    }

    get abandonedBy(): ActorEntity | null {
        return this.props.abandonedBy;
    }

    get source(): ReportSource {
        return this.props.source;
    }

    get location(): ReportLocationEntity {
        return this.props.location;
    }

    locationStyle(location: LocationMethod): LocationMethodStyle {
        const methodMap: Record<LocationMethod, LocationMethodStyle> = {
            [LocationMethod.AUTO]: LocationMethodStyle.AUTO,
            [LocationMethod.MANUAL]: LocationMethodStyle.MANUAL,
            [LocationMethod.UNKNOWN]: LocationMethodStyle.UNKNOWN,
        };
        return methodMap[location];
    }

    get reportType(): ReportType {
        return this.props.reportType;
    }

    get reportTypeKey(): string {
        return this.props.reportTypeKey;
    }

    get operators(): TelecomOperator[] {
        return this.props.operators;
    }

    get operatorsKey(): TelecomOperatorDto[] {
        return this.props.operatorsKey;
    }

    get description(): string {
        return this.props.description;
    }

    get media(): ReportMediaEntity | null {
        return this.props.media;
    }

    get treater(): DetailsTreaterInfo {
        return this.props.treater;
    }

    get status(): Status {
        return this.props.status;
    }

    dialogState(): StatusLabel {
        const methodMap: Record<Status, StatusLabel> = {
            [Status.ABANDONED]: StatusLabel.abandoned,
            [Status.APPROVED]: StatusLabel.approved,
            [Status.CONFIRMED]: StatusLabel.confirmed,
            [Status.IN_PROGRESS]: StatusLabel['in-progress'],
            [Status.REJECTED]: StatusLabel.rejected,
            [Status.TERMINATED]: StatusLabel.terminated,
            [Status.PENDING]: StatusLabel.pending,
        };
        return methodMap[this.props.status];
    }

    dialogStateStyle(): StatusStyle {
        const methodMap: Record<Status, StatusStyle> = {
            [Status.ABANDONED]: StatusStyle.ABANDONED,
            [Status.APPROVED]: StatusStyle.APPROVED,
            [Status.CONFIRMED]: StatusStyle.CONFIRMED,
            [Status.IN_PROGRESS]: StatusStyle.IN_PROGRESS,
            [Status.REJECTED]: StatusStyle.REJECTED,
            [Status.TERMINATED]: StatusStyle.TERMINATED,
            [Status.PENDING]: StatusStyle.PENDING,
        };
        return methodMap[this.props.status];
    }

    get qualificationState(): DetailsQualificationState | null {
        return this.props.qualificationState;
    }

    get region(): AdministrativeBoundaryEntity | null {
        return this.props.region;
    }

    get department(): AdministrativeBoundaryEntity | null {
        return this.props.department;
    }

    get municipality(): AdministrativeBoundaryEntity | null {
        return this.props.municipality;
    }

    get timestamps(): TimestampsEntity {
        return this.props.timestamps;
    }

    get createdAt(): string {
        return this.props.createdAt;
    }

    get updatedAt(): string {
        return this.props.updatedAt;
    }

    get reportedAt(): string {
        return this.props.reportedAt;
    }

    get placePhoto(): string {
        return this.props.placePhoto;
    }

    get accessPlacePhoto(): string {
        return this.props.accessPlacePhoto;
    }

    get placeDescription(): string {
        return this.props.placeDescription;
    }

    get confirmCount(): number {
        return this.props.confirmCount;
    }

    public get title(): string {
        return detailsTitle({
            props: this.props,
            permissions: this.permissions,
        });
    }

    public get labelButtonSubmit(): string {
        return detailsLabelButtonSubmit({
            props: this.props,
            permissions: this.permissions,
        });
    }

    public get getLongLat(): string {
        return `${this.location.coordinates.longitude} ${this.location.coordinates.latitude}`;
    }

    public get canTake(): boolean {
        return detailsPermissionsTake(this.props, this.permissions.canTake);
    }

    public get canQualify(): boolean {
        return detailsPermissionsApprove(
            this.props,
            this.permissions.canQualify
        );
    }

    public get statusPending(): boolean {
        return this.status === Status.PENDING;
    }

    public get statusInProgress(): boolean {
        return this.status === Status['IN_PROGRESS'];
    }

    public get statusReject(): boolean {
        return this.status === Status.REJECTED;
    }

    private get statusApproved(): boolean {
        return this.status === Status.APPROVED;
    }

    public get updateWorkflowTimestamps(): ManagementTimestamp[] {
        return managementWorkflowTimestamps(this.props);
    }

    public displayApproveComment(): boolean {
        return (
            !(
                this.status === Status.PENDING ||
                this.status === Status.IN_PROGRESS
            ) && this.type === 'requests'
        );
    }

    public with(props: DetailsProps): DetailsEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new DetailsEntity(props, this.permissions);
    }
}
