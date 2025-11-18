// details.entity.ts
export enum ReportSource {
    APP = 'app',
    WEB = 'web',
    ADMIN = 'admin',
}

export enum LocationMethod {
    AUTO = 'auto',
    MANUAL = 'manual',
}

export enum LocationType {
    GPS = 'gps',
    NETWORK = 'network',
    MANUAL = 'manual',
}

export enum ReportType {
    ABI = 'abi',
    ZOB = 'zob',
    OTHER = 'other',
}

export enum TelecomOperator {
    MTN = 'mtn',
    ORANGE = 'orange',
    MOOV = 'moov',
}

export enum ReportStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    ABANDONED = 'abandoned',
    RECEIVED = 'received',
    'IN-PROGRESS' = 'in progress',
    TERMINATED = 'terminated',
    CONFIRM = 'confirm',
}

export enum PriorityLevel {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical',
}

export interface Coordinates {
    latitude: number;
    longitude: number;
    what3words: string | null;
}

export interface ReportLocation {
    coordinates: Coordinates;
    method: LocationMethod;
    type: LocationType;
    name: string;
    description: string;
}

export interface ReportMedia {
    placePhoto: string | null;
    accessPlacePhoto: string | null;
}

export interface ApprovalInfo {
    approvedBy: string | null;
    approvedAt: string | null;
    rejectedBy: string | null;
    rejectedAt: string | null;
    confirmedBy: string | null;
    confirmedAt: string | null;
    abandonedBy: string | null;
    abandonedAt: string | null;
    approvedComment: string | null;
    rejectedComment: string | null;
    confirmedComment: string | null;
    abandonedComment: string | null;
    confirmCount: number;
    denyCount: number;
    reason: string | null;
}

export interface DuplicationInfo {
    isDuplicated: boolean;
    duplicateOf: string | null;
}

export interface AdministrativeDivision {
    regionId: number;
    departmentId: number;
    municipalityId: number;
    region: string | null;
    department: string | null;
    municipality: string | null;
}

export interface InitiatorInfo {
    lastName: string;
    firstName: string;
    phone: string;
}

export interface Timestamps {
    createdAt: string;
    updatedAt: string;
}

export interface Details {
    readonly id: string;
    readonly uniqId: string;
    readonly initiatedBy: string;
    readonly initiatorPhone: string;
    readonly initiator: InitiatorInfo;
    readonly source: ReportSource;
    readonly location: ReportLocation;
    readonly reportType: ReportType;
    readonly operators: TelecomOperator[];
    readonly cumulativeOperators: TelecomOperator[];
    readonly description: string;
    readonly media: ReportMedia;
    readonly approval: ApprovalInfo;
    readonly status: ReportStatus;
    readonly duplication: DuplicationInfo;
    readonly position: string;
    readonly administrative: AdministrativeDivision;
    readonly timestamps: Timestamps;
    readonly createdAt: string;
}

export class DetailsEntity implements Details {
    constructor(
        public readonly id: string,
        public readonly uniqId: string,
        public readonly initiatedBy: string,
        public readonly initiatorPhone: string,
        public readonly initiator: InitiatorInfo,
        public readonly source: ReportSource,
        public readonly location: ReportLocation,
        public readonly reportType: ReportType,
        public readonly operators: TelecomOperator[],
        public readonly cumulativeOperators: TelecomOperator[],
        public readonly description: string,
        public readonly media: ReportMedia,
        public readonly approval: ApprovalInfo,
        public readonly status: ReportStatus,
        public readonly duplication: DuplicationInfo,
        public readonly position: string,
        public readonly administrative: AdministrativeDivision,
        public readonly timestamps: Timestamps,
        public readonly createdAt: string
    ) {}

    public get managementPrams(): string {
        if (this.status === ReportStatus.PENDING) {
            return 'take';
        } else if (this.status === ReportStatus.RECEIVED) {
            return 'approve';
        } else if (this.status === ReportStatus['IN-PROGRESS']) {
            return 'treat';
        } else if (this.status === ReportStatus.TERMINATED) {
            return 'finalize';
        } else {
            return 'see';
        }
    }

    public get managementTitle(): string {
        const titleMap: Record<string, string> = {
            pending: 'MANAGEMENT.STATUS.PRISE_EN_CHARGE',
            received: 'MANAGEMENT.STATUS.APPROBATION',
            'in progress': 'MANAGEMENT.STATUS.TREATMENT',
            terminated: 'MANAGEMENT.STATUS.FINALIZATION',
        };
        return titleMap[this.status] || 'MANAGEMENT.STATUS.INFORMATION';
    }

    public get isManaged(): boolean {
        return this.managementPrams !== 'see';
    }

    public get isPending(): boolean {
        return this.status === ReportStatus.PENDING;
    }

    public get isReceived(): boolean {
        return this.status === ReportStatus.RECEIVED;
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
            (this.isPending || this.isRejected()) &&
            !this.duplication.isDuplicated &&
            this.hasValidLocation()
        );
    }

    public canBeApproved(): boolean {
        return (
            this.isReceived &&
            !this.duplication.isDuplicated &&
            this.hasValidLocation()
        );
    }

    public canBeRejected(): boolean {
        return this.isPending && !this.duplication.isDuplicated;
    }

    public requiresImmediateAttention(): boolean {
        return (
            this.getPriorityLevel() === PriorityLevel.CRITICAL ||
            (this.isRecent(1) &&
                this.hasCompletePhotos() &&
                this.hasMultipleOperators())
        );
    }

    // === MÉTHODES DE LOCALISATION ===
    public hasValidLocation(): boolean {
        const { latitude, longitude } = this.location.coordinates;
        return (
            !isNaN(latitude) &&
            !isNaN(longitude) &&
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
        const allOperators = [...this.operators, ...this.cumulativeOperators];
        return [...new Set(allOperators)];
    }

    // === MÉTHODES D'APPROBATION ET VOTES ===
    public getConfirmationRatio(): number {
        const totalVotes = this.approval.confirmCount + this.approval.denyCount;
        return totalVotes > 0 ? this.approval.confirmCount / totalVotes : 0;
    }

    public isHighlyConfirmed(): boolean {
        return this.getConfirmationRatio() >= 0.7;
    }

    public hasConflictingVotes(): boolean {
        const totalVotes = this.approval.confirmCount + this.approval.denyCount;
        return (
            totalVotes >= 5 &&
            this.getConfirmationRatio() >= 0.4 &&
            this.getConfirmationRatio() <= 0.6
        );
    }

    public hasSufficientVotes(): boolean {
        return this.approval.confirmCount + this.approval.denyCount >= 3;
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

    public isFromWeb(): boolean {
        return this.source === ReportSource.WEB;
    }

    public isFromAdmin(): boolean {
        return this.source === ReportSource.ADMIN;
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

    public isFromReliableSource(): boolean {
        return (
            this.source === ReportSource.APP ||
            this.source === ReportSource.ADMIN
        );
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
        if (this.isFromReliableSource()) score += 1;
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
            updates.initiatedBy ?? this.initiatedBy,
            updates.initiatorPhone ?? this.initiatorPhone,
            updates.initiator ?? this.initiator,
            updates.source ?? this.source,
            updates.location ?? this.location,
            updates.reportType ?? this.reportType,
            updates.operators ?? this.operators,
            updates.cumulativeOperators ?? this.cumulativeOperators,
            updates.description ?? this.description,
            updates.media ?? this.media,
            updates.approval ?? this.approval,
            updates.status ?? this.status,
            updates.duplication ?? this.duplication,
            updates.position ?? this.position,
            updates.administrative ?? this.administrative,
            updates.timestamps ?? this.timestamps,
            updates.createdAt ?? this.createdAt
        );
    }

    // === MÉTHODES DE TRANSITION D'ÉTAT ===
    public markAsApproved(
        approvedBy: string,
        comment: string = ''
    ): DetailsEntity {
        return this.clone({
            status: ReportStatus.APPROVED,
            approval: {
                ...this.approval,
                approvedBy,
                approvedAt: new Date().toISOString(),
                approvedComment: comment,
            },
        });
    }

    public markAsRejected(
        rejectedBy: string,
        comment: string = ''
    ): DetailsEntity {
        return this.clone({
            status: ReportStatus.REJECTED,
            approval: {
                ...this.approval,
                rejectedBy,
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
            approval: {
                ...this.approval,
                abandonedBy,
                abandonedAt: new Date().toISOString(),
                abandonedComment: comment,
            },
        });
    }
}
