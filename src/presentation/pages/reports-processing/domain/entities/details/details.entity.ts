import { AdministrativeBoundaryDto } from '@shared/data/dtos/administrative-boundary.dto';
import { ActorEntity } from '@shared/domain/entities/actor.entity';
import { AdministrativeBoundaryEntity } from '@shared/domain/entities/administrative-boundary.entity';
import { ReportLocationEntity } from '@shared/domain/entities/report-location.entity';
import { ReportMediaEntity } from '@shared/domain/entities/report-media.entity';
import { TimestampsEntity } from '@shared/domain/entities/timestamps.entity';
import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';

export type ManagementAction =
    | 'take'
    | 'approve'
    | 'treat'
    | 'finalize'
    | 'see';
export enum ReportStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    ABANDONED = 'abandoned',
    'IN_PROGRESS' = 'in-progress',
    TERMINATED = 'terminated',
    CONFIRM = 'confirmed',
    PROCESSING = 'processing',
    FINALIZATION = 'finalization',
}

export enum ReportState {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    IN_PROGRESS = 'in-progress',
    COMPLETED = 'completed',
    TERMINATED = 'terminated',
}

export enum QualificationState {
    COMPLETED = 'completed',
}

export enum ProcessingState {
    PENDING = 'pending',
    IN_PROGRESS = 'in-progress',
}

export enum FinalizationState {
    PENDING = 'pending',
    IN_PROGRESS = 'in-progress',
}

export interface TreaterInfo {
    acknowledgedAt: string | null;
    createdAt: string;
    reportedAt: string;
    processedAt: string | null;
    approvedAt: string | null;
    finalizedAt: string | null;
    rejectedAt: string | null;
    confirmedAt: string | null;
    abandonedAt: string | null;
    processedComment: string | null;
    approvedComment: string | null;
    rejectedComment: string | null;
    acknowledgedComment: string | null;
    confirmedComment: string | null;
    abandonedComment: string | null;
    denyCount: number;
    reason: string | null;
}

export interface AdministrativeDivision {
    regionId: number;
    departmentId: number;
    municipalityId: number;
    region: AdministrativeBoundaryDto;
    department: AdministrativeBoundaryDto;
    municipality: AdministrativeBoundaryDto;
}

export interface Details {
    readonly uniqId: string;
    readonly reportUniqId: string;
    readonly initiatorPhone: string;
    readonly initiator: ActorEntity | null;
    readonly acknowledgedBy: ActorEntity | null;
    readonly processedBy: ActorEntity | null;
    readonly approvedBy: ActorEntity | null;
    readonly rejectedBy: ActorEntity | null;
    readonly confirmedBy: ActorEntity | null;
    readonly abandonedBy: ActorEntity | null;
    readonly source: ReportSource;
    readonly location: ReportLocationEntity;
    readonly reportType: ReportType;
    readonly operators: TelecomOperator[];
    readonly description: string;
    readonly media: ReportMediaEntity | null;
    readonly treater: TreaterInfo;
    readonly status: ReportStatus;
    readonly qualificationState: QualificationState | null;
    readonly processingState: ProcessingState | null;
    readonly finalizationState: FinalizationState | null;
    readonly state: ReportState;
    readonly region: AdministrativeBoundaryEntity | null;
    readonly department: AdministrativeBoundaryEntity | null;
    readonly municipality: AdministrativeBoundaryEntity | null;
    readonly timestamps: TimestampsEntity;
    readonly createdAt: string;
    readonly reportedAt: string;
    readonly placePhoto: string;
    readonly accessPlacePhoto: string;
    readonly confirmCount: number;
    readonly reportProcessingsCount: number;
}

export class DetailsEntity implements Details {
    public validate(): string[] {
        const errors: string[] = [];

        if (!this.reportType) errors.push('Report type is required');
        if (this.operators.length === 0) errors.push('At least one operator required');

        return errors;
    }
    constructor(
        public readonly uniqId: string,
        public readonly reportUniqId: string,
        public readonly initiatorPhone: string,
        public readonly initiator: ActorEntity | null,
        public readonly acknowledgedBy: ActorEntity | null,
        public readonly processedBy: ActorEntity | null,
        public readonly approvedBy: ActorEntity | null,
        public readonly rejectedBy: ActorEntity | null,
        public readonly confirmedBy: ActorEntity | null,
        public readonly abandonedBy: ActorEntity | null,
        public readonly source: ReportSource,
        public readonly location: ReportLocationEntity,
        public readonly reportType: ReportType,
        public readonly operators: TelecomOperator[],
        public readonly description: string,
        public readonly media: ReportMediaEntity | null,
        public readonly treater: TreaterInfo,
        public readonly qualificationState: QualificationState | null,
        public readonly processingState: ProcessingState | null,
        public readonly finalizationState: FinalizationState | null,
        public readonly status: ReportStatus,
        public readonly state: ReportState,
        public readonly region: AdministrativeBoundaryEntity | null,
        public readonly department: AdministrativeBoundaryEntity | null,
        public readonly municipality: AdministrativeBoundaryEntity | null,
        public readonly timestamps: TimestampsEntity,
        public readonly createdAt: string,
        public readonly reportedAt: string,
        public readonly placePhoto: string,
        public readonly accessPlacePhoto: string,
        public readonly confirmCount: number,
        public readonly reportProcessingsCount: number
    ) { }

    public get managementTitle(): string {
        switch (this.status) {
            case ReportStatus.PENDING:
                return 'MANAGEMENT.STATUS.TAKE';
            case ReportStatus['IN_PROGRESS']:
                return 'MANAGEMENT.STATUS.APPROBATION';
            case ReportStatus.PROCESSING:
                if (this.qualificationState === QualificationState.COMPLETED) {
                    return 'MANAGEMENT.STATUS.INFORMATION';
                }
                if (this.state === ReportState.PENDING) {
                    return 'MANAGEMENT.STATUS.TAKE';
                } else if (this.state === ReportState.IN_PROGRESS) {
                    return 'MANAGEMENT.STATUS.TREATMENT';
                }
                return 'MANAGEMENT.STATUS.INFORMATION';
            case ReportStatus.FINALIZATION:
                if (this.state === ReportState.PENDING) {
                    return 'MANAGEMENT.STATUS.TAKE';
                } else if (this.state === ReportState.IN_PROGRESS) {
                    return 'MANAGEMENT.STATUS.FINALIZATION';
                }
                return 'MANAGEMENT.STATUS.INFORMATION';
            default:
                return 'MANAGEMENT.STATUS.INFORMATION';
        }
    }

    public get managementButtonSubmitText(): string {
        switch (this.status) {
            case ReportStatus.PENDING:
                return 'MANAGEMENT.BUTTONS.TAKE';
            case ReportStatus['IN_PROGRESS']:
                return 'MANAGEMENT.BUTTONS.APPROBATION';
            case ReportStatus.PROCESSING:
                if (this.qualificationState === QualificationState.COMPLETED) {
                    return 'MANAGEMENT.BUTTONS.INFORMATION';
                }
                if (this.state === ReportState.PENDING) {
                    return 'MANAGEMENT.BUTTONS.TAKE';
                } else if (this.state === ReportState.IN_PROGRESS) {
                    return 'MANAGEMENT.BUTTONS.TREATMENT';
                }
                return 'MANAGEMENT.BUTTONS.INFORMATION';
            case ReportStatus.FINALIZATION:
                if (this.state === ReportState.PENDING) {
                    return 'MANAGEMENT.BUTTONS.TAKE';
                } else if (this.state === ReportState.IN_PROGRESS) {
                    return 'MANAGEMENT.BUTTONS.FINALIZATION';
                }
                return 'MANAGEMENT.BUTTONS.INFORMATION';
            default:
                return 'MANAGEMENT.BUTTONS.INFORMATION';
        }
    }

    public get getLongLat(): string {
        return `${this.location.coordinates.longitude} ${this.location.coordinates.latitude}`;
    }


    public get detailsParams(): ManagementAction {
        if (this.canBeTaken) {
            return 'take';
        } else if (this.canBeApproved) {
            return 'approve';
        } else if (this.canBeTreated) {
            return 'treat';
        } else if (this.canBeFinalized) {
            return 'finalize';
        } else if (this.status === ReportStatus.TERMINATED) {
            return 'finalize';
        } else {
            return 'see';
        }
    }

    public get statusPending(): boolean {
        return this.status === ReportStatus.PENDING;
    }

    public get statusInProgress(): boolean {
        return this.status === ReportStatus['IN_PROGRESS'];
    }

    private get statusProcessing(): boolean {
        return this.status === ReportStatus.PROCESSING;
    }

    private get statusFinalization(): boolean {
        return this.status === ReportStatus.FINALIZATION;
    }

    private get statusApproved(): boolean {
        return this.status === ReportStatus.APPROVED;
    }

    public get statePending(): boolean {
        return this.state === ReportState.PENDING;
    }

    private get stateInProgress(): boolean {
        return this.state === ReportState.IN_PROGRESS;
    }

    public get stateCompleted(): boolean {
        return this.state === ReportState.COMPLETED;
    }

    private get submissionStatePending(): boolean {
        return this.state === ReportState.PENDING;
    }

    private get submissionStateInProgress(): boolean {
        return this.state === ReportState.IN_PROGRESS;
    }

    private get progressingStatePending(): boolean {
        return this.processingState === ProcessingState.PENDING;
    }

    private get progressingStateInProgress(): boolean {
        return this.processingState === ProcessingState.IN_PROGRESS;
    }

    private get finalizationStatePending(): boolean {
        return this.finalizationState === FinalizationState.PENDING;
    }

    private get finalizationStateInProgress(): boolean {
        return this.finalizationState === FinalizationState.IN_PROGRESS;
    }

    public get canBeTaken(): boolean {
        return (this.statusPending ||
            (this.progressingStatePending) ||
            (this.finalizationStatePending)
        );
    }

    public get canBeApproved(): boolean {
        return this.statusInProgress;
    }

    public get canBeTreated(): boolean {
        return this.progressingStateInProgress;
    }

    public get canBeFinalized(): boolean {
        return this.finalizationStateInProgress;
    }

    public toString(): string {
        return `DetailsEntity[id=${this.uniqId}, type=${this.reportType}, status=${this.status}, operators=${this.operators.join(',')}]`;
    }

    public equals(other: DetailsEntity): boolean {
        return this.uniqId === other.uniqId;
    }

    public clone(updates: Partial<Details>): DetailsEntity {
        return new DetailsEntity(
            updates.uniqId ?? this.uniqId,
            updates.reportUniqId ?? this.reportUniqId,
            updates.initiatorPhone ?? this.initiatorPhone,
            updates.initiator ?? this.initiator,
            updates.acknowledgedBy ?? this.acknowledgedBy,
            updates.processedBy ?? this.processedBy,
            updates.approvedBy ?? this.approvedBy,
            updates.rejectedBy ?? this.rejectedBy,
            updates.confirmedBy ?? this.confirmedBy,
            updates.abandonedBy ?? this.abandonedBy,
            updates.source ?? this.source,
            updates.location ?? this.location,
            updates.reportType ?? this.reportType,
            updates.operators ?? this.operators,
            updates.description ?? this.description,
            updates.media ?? this.media,
            updates.treater ?? this.treater,
            updates.qualificationState ?? this.qualificationState,
            updates.processingState ?? this.processingState,
            updates.finalizationState ?? this.finalizationState,
            updates.status ?? this.status,
            updates.state ?? this.state,
            updates.region ?? this.region,
            updates.department ?? this.department,
            updates.municipality ?? this.municipality,
            updates.timestamps ?? this.timestamps,
            updates.createdAt ?? this.createdAt,
            updates.reportedAt ?? this.reportedAt,
            updates.placePhoto ?? this.placePhoto,
            updates.accessPlacePhoto ?? this.accessPlacePhoto,
            updates.confirmCount ?? this.confirmCount,
            updates.reportProcessingsCount ?? this.reportProcessingsCount
        );
    }
}
