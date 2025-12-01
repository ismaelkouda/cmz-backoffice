import { LocationMethod } from '@shared/domain/enums/location-method.enum';
import { LocationType } from '@shared/domain/enums/location-type.enum';
import { PriorityLevel } from '@shared/domain/enums/priority-level.enum';
import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';
import { DuplicationInfo } from '@shared/domain/interfaces/duplication-info.interface';
import { ReportLocation } from '@shared/domain/interfaces/report-location.interface';
import { ReportMedia } from '@shared/domain/interfaces/report-media.interface';
import { Timestamps } from '@shared/domain/interfaces/timestamps.interface';

export enum ReportState {
    COMPLETED = 'completer',
}

export interface All {
    readonly id: string;
    readonly uniqId: string;
    readonly initiatedBy: string;
    readonly source: ReportSource;
    readonly location: ReportLocation;
    readonly reportType: ReportType;
    readonly operators: TelecomOperator[];
    readonly cumulativeOperators: TelecomOperator[];
    readonly description: string;
    readonly media: ReportMedia;
    readonly state: ReportState;
    readonly duplication: DuplicationInfo;
    readonly position: string;
    readonly timestamps: Timestamps;
    readonly createdAt: string;
}

export class AllEntity implements All {
    constructor(
        public readonly id: string,
        public readonly uniqId: string,
        public readonly initiatedBy: string,
        public readonly source: ReportSource,
        public readonly location: ReportLocation,
        public readonly reportType: ReportType,
        public readonly operators: TelecomOperator[],
        public readonly cumulativeOperators: TelecomOperator[],
        public readonly description: string,
        public readonly media: ReportMedia,
        public readonly state: ReportState,
        public readonly duplication: DuplicationInfo,
        public readonly position: string,
        public readonly timestamps: Timestamps,
        public readonly createdAt: string
    ) { }

    public isCompleted(): boolean {
        return this.state === ReportState.COMPLETED;
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

    public isDuplicate(): boolean {
        return this.duplication.isDuplicated;
    }

    public hasDuplicates(): boolean {
        return this.duplication.duplicateOf !== null;
    }

    public isFromMobileApp(): boolean {
        return this.source === ReportSource.APP;
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

    public get reportDescription(): string {
        const reportDescription: Record<string, string> = {
            ABI: 'REPORTS_REQUESTS.QUEUES.OPTIONS.REPORT_TYPE.NO_INTERNET',
            CPS: 'REPORTS_REQUESTS.QUEUES.OPTIONS.REPORT_TYPE.PARTIAL_SIGNAL',
            CPO: 'REPORTS_REQUESTS.QUEUES.OPTIONS.REPORT_TYPE.PARTIAL_OPERATOR',
            ZOB: 'REPORTS_REQUESTS.QUEUES.OPTIONS.REPORT_TYPE.WHITE_ZONE',
        };
        return reportDescription[this.reportType] || this.reportType;
    }

    public get sourceDescription(): string {
        const sourceDescription: Record<string, string> = {
            App: 'REPORTS_REQUESTS.QUEUES.OPTIONS.SOURCE.APP',
            USSD: 'REPORTS_REQUESTS.QUEUES.OPTIONS.SOURCE.USSD',
            SMS: 'REPORTS_REQUESTS.QUEUES.OPTIONS.SOURCE.SMS',
            IVR: 'REPORTS_REQUESTS.QUEUES.OPTIONS.SOURCE.IVR',
        };
        return sourceDescription[this.source] || this.source;
    }

    public calculatePriorityScore(): number {
        let score = 0;

        if (this.hasCompletePhotos()) score += 3;

        if (this.hasPreciseCoordinates()) score += 2;

        if (this.hasMultipleOperators()) score += 2;

        if (this.isUrgent()) score += 3;

        if (this.isRecent(1)) score += 1;

        if (this.isDuplicate()) score -= 5;

        return Math.max(0, score);
    }

    public getPriorityLevel(): 'low' | 'medium' | 'high' | 'critical' {
        const score = this.calculatePriorityScore();

        if (score >= 7) return 'critical';
        if (score >= 5) return 'high';
        if (score >= 3) return 'medium';
        return 'low';
    }

    public isHighPriority(): boolean {
        const level = this.getPriorityLevel();
        return level === PriorityLevel.HIGH || level === PriorityLevel.CRITICAL;
    }

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

    public toString(): string {
        return `AllEntity[id=${this.id}, type=${this.reportType}, state=${this.state}, operators=${this.operators.join(',')}]`;
    }

    public equals(other: AllEntity): boolean {
        return this.id === other.id;
    }

    public clone(updates: Partial<All>): AllEntity {
        return new AllEntity(
            updates.id ?? this.id,
            updates.uniqId ?? this.uniqId,
            updates.initiatedBy ?? this.initiatedBy,
            updates.source ?? this.source,
            updates.location ?? this.location,
            updates.reportType ?? this.reportType,
            updates.operators ?? this.operators,
            updates.cumulativeOperators ?? this.cumulativeOperators,
            updates.description ?? this.description,
            updates.media ?? this.media,
            updates.state ?? this.state,
            updates.duplication ?? this.duplication,
            updates.position ?? this.position,
            updates.timestamps ?? this.timestamps,
            updates.createdAt ?? this.createdAt
        );
    }
}
