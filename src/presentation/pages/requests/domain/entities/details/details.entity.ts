import { managementWorkflowTimestamps } from '@shared/components/management/domain/functions/management-timestamps.function';
import { ManagementTimestamp } from '@shared/components/management/domain/interfaces/management-timestamps.interface';
import { ActorEntity } from '@shared/domain/entities/actor.entity';
import { AdministrativeBoundaryEntity } from '@shared/domain/entities/administrative-boundary.entity';
import { ReportLocationEntity } from '@shared/domain/entities/report-location.entity';
import { ReportMediaEntity } from '@shared/domain/entities/report-media.entity';
import { TimestampsEntity } from '@shared/domain/entities/timestamps.entity';
import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';

import { DetailsQualificationState } from '@presentation/pages/requests/domain/enums/details/details-qualification-state/details-qualification-state.enum';
import { Status } from '@presentation/pages/requests/domain/enums/details/details-status/details-status.enum';
import { detailsLabelButtonSubmit } from '@presentation/pages/requests/domain/functions/details/details-label-button-submit.function';
import { detailsPermissionsApprove } from '@presentation/pages/requests/domain/functions/details/details-permissions-approve.function';
import { detailsPermissionsManage } from '@presentation/pages/requests/domain/functions/details/details-permissions-manage.function';
import { detailsPermissionsTake } from '@presentation/pages/requests/domain/functions/details/details-permissions-take.function';
import { detailsTitle } from '@presentation/pages/requests/domain/functions/details/details-title.function';
import { DetailsProps } from '@presentation/pages/requests/domain/interfaces/details/details-props.interface';
import { DetailsPermissions } from '@presentation/pages/requests/domain/types/details/details-permissions.type';
import { DetailsTreaterInfo } from '@presentation/pages/requests/domain/types/details/details-treater-info.type';

export class DetailsEntity {
    constructor(private readonly props: DetailsProps) {}

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

    get reportType(): ReportType {
        return this.props.reportType;
    }

    get operators(): TelecomOperator[] {
        return this.props.operators;
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

    get confirmCount(): number {
        return this.props.confirmCount;
    }

    public get title(): string {
        return detailsTitle(this.props);
    }

    public get labelButtonSubmit(): string {
        return detailsLabelButtonSubmit(this.props);
    }

    public get getLongLat(): string {
        return `${this.location.coordinates.longitude} ${this.location.coordinates.latitude}`;
    }

    public get permissions(): DetailsPermissions {
        return detailsPermissionsManage(this.props);
    }

    public get canBeTaken(): boolean {
        return detailsPermissionsTake(this.props);
    }

    public get canBeApproved(): boolean {
        console.log(
            'detailsPermissionsApprove(this.props): ',
            detailsPermissionsApprove(this.props)
        );
        return detailsPermissionsApprove(this.props);
    }

    public get statusPending(): boolean {
        return this.status === Status.PENDING;
    }

    public get statusInProgress(): boolean {
        return this.status === Status['IN_PROGRESS'];
    }

    private get statusApproved(): boolean {
        return this.status === Status.APPROVED;
    }

    public get updateWorkflowTimestamps(): ManagementTimestamp[] {
        return managementWorkflowTimestamps(this.props);
    }

    public with(props: DetailsProps): DetailsEntity {
        if (this.updatedAt === props.updatedAt) {
            return this;
        }
        return new DetailsEntity(props);
    }
}
