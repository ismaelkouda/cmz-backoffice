import { LocationMethod } from '@shared/domain/enums/location-method.enum';
import { LocationType } from '@shared/domain/enums/location-type.enum';
import { PriorityLevel } from '@shared/domain/enums/priority-level.enum';
import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';
import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';
import { DuplicationInfo } from '@shared/domain/interfaces/duplication-info.interface';
import { ReportLocation } from '@shared/domain/interfaces/report-location.interface';
import { ReportMedia } from '@shared/domain/interfaces/report-media.interface';
import { Timestamps } from '@shared/domain/interfaces/timestamps.interface';


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
    confirmCount: number;
    denyCount: number;
    reason: string | null;
}

export interface AdministrativeDivision {
    regionId: number;
    departmentId: number;
    municipalityId: number;
    region: string | null;
    department: string | null;
    municipality: string | null;
}

export interface actorInfo {
    lastName: string;
    firstName: string;
    phone: string;
}

export interface Details {
    readonly id: string;
    readonly uniqId: string;
    readonly reportUniqId: string;
    readonly initiatedBy: string;
    readonly initiatorPhone: string;
    readonly initiator: actorInfo;
    readonly acknowledgedBy: actorInfo;
    readonly processedBy: actorInfo;
    readonly approvedBy: actorInfo;
    readonly rejectedBy: actorInfo;
    readonly confirmedBy: actorInfo;
    readonly abandonedBy: actorInfo;
    readonly source: ReportSource;
    readonly location: ReportLocation;
    readonly reportType: ReportType;
    readonly operators: TelecomOperator[];
    readonly description: string;
    readonly media: ReportMedia;
    readonly treater: TreaterInfo;
    readonly status: ReportStatus;
    readonly state: ReportState;
    readonly duplication: DuplicationInfo;
    readonly position: string;
    readonly administrative: AdministrativeDivision;
    readonly timestamps: Timestamps;
    readonly createdAt: string;
    readonly reportedAt: string;
    readonly placePhoto: string;
    readonly accessPlacePhoto: string;
}

export class DetailsEntity implements Details {
    constructor(
        public readonly id: string,
        public readonly uniqId: string,
        public readonly reportUniqId: string,
        public readonly initiatedBy: string,
        public readonly initiatorPhone: string,
        public readonly initiator: actorInfo,
        public readonly acknowledgedBy: actorInfo,
        public readonly processedBy: actorInfo,
        public readonly approvedBy: actorInfo,
        public readonly rejectedBy: actorInfo,
        public readonly confirmedBy: actorInfo,
        public readonly abandonedBy: actorInfo,
        public readonly source: ReportSource,
        public readonly location: ReportLocation,
        public readonly reportType: ReportType,
        public readonly operators: TelecomOperator[],
        public readonly description: string,
        public readonly media: ReportMedia,
        public readonly treater: TreaterInfo,
        public readonly status: ReportStatus,
        public readonly state: ReportState,
        public readonly duplication: DuplicationInfo,
        public readonly position: string,
        public readonly administrative: AdministrativeDivision,
        public readonly timestamps: Timestamps,
        public readonly createdAt: string,
        public readonly reportedAt: string,
        public readonly placePhoto: string,
        public readonly accessPlacePhoto: string
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

    public get managementPrams(): ManagementAction {
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

    public requiresImmediateAttention(): boolean {
        return (
            this.getPriorityLevel() === PriorityLevel.CRITICAL ||
            (this.isRecent(1) &&
                this.hasCompletePhotos() &&
                this.hasMultipleOperators())
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

    public hasManualLocation(): boolean {
        return (
            this.location.method === LocationMethod.MANUAL ||
            this.location.type === LocationType.MANUAL
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

    // === MÉTHODES DE MÉDIAS ===
    public hasPhotos(): boolean {
        return !!this.media.placePhoto || !!this.media.accessPlacePhoto;
    }

    public hasPlacePhoto(): boolean {
        return !!this.media.placePhoto;
    }

    public hasAccessPhoto(): boolean {
        return !!this.media.accessPlacePhoto;
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

    public involvesOperator(operator: TelecomOperator): boolean {
        return this.operators.includes(operator);
    }

    public getUniqueOperators(): TelecomOperator[] {
        return [...new Set(this.operators)];
    }

    // === MÉTHODES D'APPROBATION ET VOTES ===
    public getConfirmationRatio(): number {
        const totalVotes = this.treater.confirmCount + this.treater.denyCount;
        return totalVotes > 0 ? this.treater.confirmCount / totalVotes : 0;
    }

    public isHighlyConfirmed(): boolean {
        return this.getConfirmationRatio() >= 0.7;
    }

    public hasConflictingVotes(): boolean {
        const totalVotes = this.treater.confirmCount + this.treater.denyCount;
        return (
            totalVotes >= 5 &&
            this.getConfirmationRatio() >= 0.4 &&
            this.getConfirmationRatio() <= 0.6
        );
    }

    public hasSufficientVotes(): boolean {
        return this.treater.confirmCount + this.treater.denyCount >= 3;
    }

    // === MÉTHODES TEMPORELLES ===
    public getDaysSinceCreation(): number {
        const created = new Date(this.timestamps.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - created.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    public isRecent(daysThreshold: number = 7): boolean {
        return this.getDaysSinceCreation() <= daysThreshold;
    }

    public isStale(daysThreshold: number = 30): boolean {
        return this.getDaysSinceCreation() > daysThreshold;
    }

    public wasRecentlyUpdated(hoursThreshold: number = 24): boolean {
        const updated = new Date(this.timestamps.updatedAt);
        const now = new Date();
        const diffHours =
            Math.abs(now.getTime() - updated.getTime()) / (1000 * 60 * 60);
        return diffHours <= hoursThreshold;
    }

    public isUrgent(): boolean {
        return this.getDaysSinceCreation() === 0;
    }

    // === MÉTHODES DE DUPLICATION ===
    public isDuplicate(): boolean {
        return this.duplication.isDuplicated;
    }

    public hasDuplicates(): boolean {
        return this.duplication.duplicateOf !== null;
    }

    // === MÉTHODES DE SOURCE ===
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

    public isReportType(reportType: ReportType): boolean {
        return this.reportType === reportType;
    }

    public isAbiReport(): boolean {
        return this.reportType === ReportType.ABI;
    }

    public isZobReport(): boolean {
        return this.reportType === ReportType.ZOB;
    }

    public isOtherReport(): boolean {
        return this.reportType === ReportType.OTHER;
    }

    // === MÉTHODES DE PRIORITÉ ===
    public calculatePriorityScore(): number {
        let score = 0;

        if (this.hasCompletePhotos()) score += 3;
        if (this.hasPreciseCoordinates()) score += 2;
        if (this.hasMultipleOperators()) score += 2;
        if (this.isUrgent()) score += 3;
        if (this.isHighlyConfirmed()) score += 1;
        if (this.isRecent(1)) score += 1;
        if (this.isDuplicate()) score -= 5;

        return Math.max(0, score);
    }

    public getPriorityLevel(): PriorityLevel {
        const score = this.calculatePriorityScore();

        if (score >= 7) return PriorityLevel.CRITICAL;
        if (score >= 5) return PriorityLevel.HIGH;
        if (score >= 3) return PriorityLevel.MEDIUM;
        return PriorityLevel.LOW;
    }

    public isHighPriority(): boolean {
        const level = this.getPriorityLevel();
        return level === PriorityLevel.HIGH || level === PriorityLevel.CRITICAL;
    }

    // === VALIDATION DE COMPLÉTUDE ===
    public validateCompleteness(): {
        isValid: boolean;
        missingFields: string[];
    } {
        const missingFields: string[] = [];

        if (!this.hasValidLocation()) missingFields.push('localisation_valide');
        if (!this.hasPhotos()) missingFields.push('photos');
        if (this.operators.length === 0) missingFields.push('operateurs');
        if (!this.description || this.description.trim().length < 10)
            missingFields.push('description_complete');

        return {
            isValid: missingFields.length === 0,
            missingFields,
        };
    }

    public isReadyForAutoProcessing(): boolean {
        const completeness = this.validateCompleteness();
        return (
            completeness.isValid &&
            this.hasSufficientVotes() &&
            this.isHighlyConfirmed() &&
            !this.isDuplicate()
        );
    }

    public hasAdministrativeData(): boolean {
        return (
            this.administrative.regionId > 0 ||
            this.administrative.departmentId > 0 ||
            this.administrative.municipalityId > 0
        );
    }

    public getFullAdministrativeName(): string {
        const parts = [
            this.administrative.region,
            this.administrative.department,
            this.administrative.municipality,
        ].filter(Boolean);

        return parts.join(' - ') || 'Non spécifié';
    }

    // === MÉTHODES UTILITAIRES ===
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
            updates.initiatedBy ?? this.initiatedBy,
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
            updates.duplication ?? this.duplication,
            updates.position ?? this.position,
            updates.administrative ?? this.administrative,
            updates.timestamps ?? this.timestamps,
            updates.createdAt ?? this.createdAt,
            updates.reportedAt ?? this.reportedAt,
            updates.placePhoto ?? this.placePhoto,
            updates.accessPlacePhoto ?? this.accessPlacePhoto
        );
    }

    public markAsApproved(
        approvedBy: string,
        comment: string = ''
    ): DetailsEntity {
        return this.clone({
            status: ReportStatus.APPROVED,
            treater: {
                ...this.treater,
                approvedAt: new Date().toISOString(),
                approvedComment: comment,
            },
        });
    }

    public markAsProcessed(
        processedBy: string,
        comment: string = ''
    ): DetailsEntity {
        return this.clone({
            status: ReportStatus.PROCESSING,
            treater: {
                ...this.treater,
                processedAt: new Date().toISOString(),
                processedComment: comment,
            },
        });
    }

    public markAsAcknowledgedBy(
        acknowledgedBy: string,
        comment: string = ''
    ): DetailsEntity {
        return this.clone({
            status: ReportStatus.APPROVED,
            treater: {
                ...this.treater,
                acknowledgedAt: new Date().toISOString(),
                acknowledgedComment: comment,
            },
        });
    }

    public markAsRejected(comment: string = ''): DetailsEntity {
        return this.clone({
            status: ReportStatus.REJECTED,
            treater: {
                ...this.treater,
                rejectedAt: new Date().toISOString(),
                rejectedComment: comment,
            },
        });
    }

    public markAsAbandoned(
        abandonedBy: string,
        comment: string = ''
    ): DetailsEntity {
        return this.clone({
            status: ReportStatus.ABANDONED,
            treater: {
                ...this.treater,
                abandonedAt: new Date().toISOString(),
                abandonedComment: comment,
            },
        });
    }
}
