import { AdministrativeBoundaryDto } from '@shared/data/dtos/administrative-boundary.dto';
import { ActorEntity } from '@shared/domain/entities/actor.entity';
import { AdministrativeBoundaryEntity } from '@shared/domain/entities/administrative-boundary.entity';
import { ReportLocationEntity } from '@shared/domain/entities/report-location.entity';
import { ReportMediaEntity } from '@shared/domain/entities/report-media.entity';
import { TimestampsEntity } from '@shared/domain/entities/timestamps.entity';
import { LocationMethod } from '@shared/domain/enums/location-method.enum';
import { LocationType } from '@shared/domain/enums/location-type.enum';
import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';
import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';


export type ManagementAction = 'take' | 'approve' | 'treat' | 'finalize' | 'see';
export enum ReportStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    ABANDONED = 'abandoned',
    'IN-PROGRESS' = 'in-progress',
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
    readonly id: string;
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
    constructor(
        public readonly id: string,
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
        public readonly reportProcessingsCount: number,
    ) { }

    public get managementTitle(): string {
        switch (this.status) {
            case ReportStatus.PENDING:
                return 'MANAGEMENT.STATUS.TAKE';
            case ReportStatus['IN-PROGRESS']:
                return 'MANAGEMENT.STATUS.APPROBATION';
            case ReportStatus.PROCESSING:
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
            case ReportStatus['IN-PROGRESS']:
                return 'MANAGEMENT.BUTTONS.APPROBATION';
            case ReportStatus.PROCESSING:
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

    public get inProcessing(): boolean {
        return this.status === ReportStatus.PROCESSING;
    }

    public get inFinalization(): boolean {
        return this.status === ReportStatus.FINALIZATION;
    }

    public get isReceived(): boolean {
        return this.status === ReportStatus['IN-PROGRESS'];
    }

    public isApproved(): boolean {
        return this.status === ReportStatus.APPROVED;
    }

    public isRejected(): boolean {
        return this.status === ReportStatus.REJECTED;
    }

    public isAbandoned(): boolean {
        return this.status === ReportStatus.ABANDONED;
    }

    public get canBeTaken(): boolean {
        return (
            this.status === ReportStatus.PENDING ||
            (this.status === ReportStatus.PROCESSING &&
                this.state == ReportState.PENDING) ||
            (this.status === ReportStatus.FINALIZATION &&
                this.state == ReportState.PENDING)
        );
    }

    public get canBeApproved(): boolean {
        return this.status === ReportStatus['IN-PROGRESS'];
    }

    public get canBeTreated(): boolean {
        return (
            this.status === ReportStatus.PROCESSING &&
            this.state == ReportState.IN_PROGRESS
        );
    }

    public get canBeFinalized(): boolean {
        return (
            this.status === ReportStatus.FINALIZATION &&
            this.state == ReportState.IN_PROGRESS
        );
    }

    public hasValidLocation(): boolean {
        const { latitude, longitude } = this.location.coordinates;
        return (
            !Number.isNaN(latitude) &&
            !Number.isNaN(longitude) &&
            latitude >= -90 &&
            latitude <= 90 &&
            longitude >= -180 &&
            longitude <= 180
        );
    }

    public hasPreciseCoordinates(): boolean {
        if (!this.hasValidLocation()) return false;
        const { latitude, longitude } = this.location.coordinates;
        const latPrecision = latitude.toString().split('.')[1]?.length || 0;
        const longPrecision = longitude.toString().split('.')[1]?.length || 0;
        return latPrecision >= 6 && longPrecision >= 6;
    }

    public getCoordinates(): Coordinates {
        return this.location.coordinates;
    }

    public get getLongLat(): string {
        return `${this.location.coordinates.longitude} ${this.location.coordinates.latitude}`;
    }

    public hasAutomaticLocation(): boolean {
        return (
            this.location.method === LocationMethod.AUTO &&
            this.location.type === LocationType.GPS
        );
    }

    public hasWhat3Words(): boolean {
        return !!this.location.coordinates.what3words;
    }

    // === MÉTHODES DE CALCUL DE DISTANCE ===
    public calculateDistanceFrom(lat: number, long: number): number | null {
        if (!this.hasValidLocation()) return null;

        const { latitude, longitude } = this.location.coordinates;
        const R = 6371;
        const dLat = this.deg2rad(latitude - lat);
        const dLon = this.deg2rad(longitude - long);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat)) *
            Math.cos(this.deg2rad(latitude)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private deg2rad(deg: number): number {
        return deg * (Math.PI / 180);
    }

    public hasPhotos(): boolean {
        return !!this.media?.placePhoto || !!this.media?.accessPlacePhoto;
    }

    public hasPlacePhoto(): boolean {
        return !!this.media?.placePhoto;
    }

    public hasAccessPhoto(): boolean {
        return !!this.media?.accessPlacePhoto;
    }

    public hasCompletePhotos(): boolean {
        return this.hasPlacePhoto() && this.hasAccessPhoto();
    }

    // === MÉTHODES D'OPÉRATEURS ===
    public getOperatorCount(): number {
        return this.operators.length;
    }

    public hasMultipleOperators(): boolean {
        return this.operators.length > 1;
    }

    public isFromMobileApp(): boolean {
        return this.source === ReportSource.APP;
    }

    public isFromUssd(): boolean {
        return this.source === ReportSource.USSD;
    }

    public isFromSms(): boolean {
        return this.source === ReportSource.SMS;
    }

    public isFromIvr(): boolean {
        return this.source === ReportSource.IVR;
    }

    public isFromPwa(): boolean {
        return this.source === ReportSource.PWA;
    }

    public toString(): string {
        return `DetailsEntity[id=${this.id}, type=${this.reportType}, status=${this.status}, operators=${this.operators.join(',')}]`;
    }

    public equals(other: DetailsEntity): boolean {
        return this.id === other.id;
    }

    public clone(updates: Partial<Details>): DetailsEntity {
        return new DetailsEntity(
            updates.id ?? this.id,
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
            updates.reportProcessingsCount ?? this.reportProcessingsCount,
        );
    }
}
