import { ProcessingState } from '@pages/processing/domain/enums/details/details-processing-state/details-processing-state.enum';
import {
    State,
    StateStyle,
    StateLabel,
} from '@pages/processing/domain/enums/details/details-state/details-state.enum';
import { DetailsStatus } from '@pages/processing/domain/enums/details/details-status/details-status.enum';
import { detailsLabelButtonSubmit } from '@pages/processing/domain/functions/details/details-label-button-submit.function';
import { detailsPermissionsTake } from '@pages/processing/domain/functions/details/details-permissions-take.function';
import { detailsPermissionsTreat } from '@pages/processing/domain/functions/details/details-permissions-treat.function';
import { detailsTitle } from '@pages/processing/domain/functions/details/details-title.function';
import { DetailsProps } from '@pages/processing/domain/interfaces/details/details-props.interface';
import { DetailsTreaterInfo } from '@pages/processing/domain/types/details/details-treater-info.type';
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
        canTreat: boolean;
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
            canTreat: boolean;
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

    get status(): DetailsStatus {
        return this.props.status;
    }

    get processingState(): ProcessingState | null {
        return this.props.processingState;
    }

    get state(): State {
        return this.props.state;
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

    public get canTreat(): boolean {
        return detailsPermissionsTreat(this.props, this.permissions.canTreat);
    }

    public get statusPending(): boolean {
        return this.status === DetailsStatus.PENDING;
    }

    public get statusInProgress(): boolean {
        return this.status === DetailsStatus['IN_PROGRESS'];
    }

    private get progressingStateInProgress(): boolean {
        return this.processingState === ProcessingState.IN_PROGRESS;
    }

    public get statePending(): boolean {
        return this.state === State.PENDING;
    }

    private get stateInProgress(): boolean {
        return this.state === State.IN_PROGRESS;
    }

    public get stateCompleted(): boolean {
        return this.state === State.COMPLETED;
    }

    private get submissionStatePending(): boolean {
        return this.state === State.PENDING;
    }

    private get submissionStateInProgress(): boolean {
        return this.state === State.IN_PROGRESS;
    }

    private get progressingStatePending(): boolean {
        return this.processingState === ProcessingState.PENDING;
    }

    public get updateWorkflowTimestamps(): ManagementTimestamp[] {
        return managementWorkflowTimestamps(this.props);
    }

    public displayApproveComment(): boolean {
        return this.type === 'processing';
    }

    dialogState(): StateLabel {
        const methodMap: Record<State, StateLabel> = {
            [State.COMPLETED]: StateLabel.completed,
            [State.IN_PROGRESS]: StateLabel['in-progress'],
            [State.PENDING]: StateLabel.pending,
            [State.TERMINATED]: StateLabel.terminated,
        };
        return methodMap[this.props.state];
    }

    dialogStateStyle(): StateStyle {
        const methodMap: Record<State, StateStyle> = {
            [State.IN_PROGRESS]: StateStyle.IN_PROGRESS,
            [State.TERMINATED]: StateStyle.TERMINATED,
            [State.PENDING]: StateStyle.PENDING,
            [State.COMPLETED]: StateStyle.COMPLETED,
        };
        return methodMap[this.props.status];
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
