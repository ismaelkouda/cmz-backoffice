// details.mapper.ts
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { LocationMethod } from '@shared/domain/enums/location-method.enum';
import { LocationType } from '@shared/domain/enums/location-type.enum';
import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';
import { DuplicationInfo } from '@shared/domain/interfaces/duplication-info.interface';
import { ReportLocation } from '@shared/domain/interfaces/report-location.interface';
import { ReportMedia } from '@shared/domain/interfaces/report-media.interface';
import { Timestamps } from '@shared/domain/interfaces/timestamps.interface';
import {
    AdministrativeDivision,
    DetailsEntity,
    ReportState,
    ReportStatus,
    TreaterInfo,
    actorInfo,
} from '../../domain/entities/details/details.entity';
import {
    DetailsItemDto,
    DetailsResponseDto,
} from '../dtos/details/details-response.dto';

export class DetailsMapper extends SimpleResponseMapper<
    DetailsEntity,
    DetailsItemDto
> {
    protected override mapItemFromDto(dto: DetailsItemDto): DetailsEntity {
        return new DetailsEntity(
            dto.id,
            dto.uniq_id,
            dto.request_report_uniq_id,
            this.formatInitiatorName(dto.initiator),
            dto.initiator_phone_number,
            this.mapInitiator(dto.initiator),
            this.mapInitiator(dto.acknowledged_by),
            this.mapInitiator(dto.approved_by),
            this.mapInitiator(dto.rejected_by),
            this.mapInitiator(dto.confirmed_by),
            this.mapInitiator(dto.abandoned_by),
            this.mapReportSource(dto.source),
            this.mapLocation(dto),
            this.mapReportType(dto.report_type),
            this.mapOperators(dto.operators),
            this.mapOperators(dto.cumulative_operators),
            dto.description,
            this.mapMedia(dto),
            this.mapTreaterInfo(dto),
            this.mapReportStatus(dto.status),
            this.mapReportState(dto.state),
            this.mapDuplicationInfo(dto),
            dto.position,
            this.mapAdministrativeDivision(dto),
            this.mapTimestamps(dto),
            dto.created_at,
            dto.reported_at,
            dto.place_photo,
            dto.access_place_photo
        );
    }

    public fromResponseDtoToEntity(
        response: DetailsResponseDto
    ): DetailsEntity {
        return this.mapItemFromDto(response.data);
    }

    private formatInitiatorName(initiator: {
        last_name: string;
        first_name: string;
    }): string {
        return `${initiator.last_name} ${initiator.first_name}`.trim();
    }

    private formatApproverName(approver: {
        id: string;
        last_name: string;
        first_name: string;
    }): string | null {
        if (approver.id) {
            return `${approver.last_name} ${approver.first_name}`.trim();
        }
        return null;
    }

    private formatRejectorName(rejector: {
        last_name: string;
        first_name: string;
    }): string {
        return `${rejector.last_name} ${rejector.first_name}`.trim();
    }

    private mapInitiator(initiator: {
        last_name: string;
        first_name: string;
        phone: string;
    }): actorInfo {
        return {
            lastName: initiator?.last_name,
            firstName: initiator?.first_name,
            phone: initiator?.phone,
        };
    }

    private mapReportSource(source: string): ReportSource {
        const sourceMap: Record<string, ReportSource> = {
            app: ReportSource.APP,
            ussd: ReportSource.USSD,
            sms: ReportSource.SMS,
            ivr: ReportSource.IVR,
        };
        return sourceMap[source] || ReportSource.APP;
    }

    private mapLocation(dto: DetailsItemDto): ReportLocation {
        return {
            coordinates: {
                latitude: this.parseCoordinate(dto.lat),
                longitude: this.parseCoordinate(dto.long),
                what3words: dto.what3words,
            },
            method: this.mapLocationMethod(dto.location_method),
            type: this.mapLocationType(dto.location_type),
            name: dto.location_name,
            description: dto.place_description,
        };
    }

    private parseCoordinate(coord: string): number {
        const parsed = Number.parseFloat(coord);
        return Number.isNaN(parsed) ? 0 : parsed;
    }

    private mapLocationMethod(method: string): LocationMethod {
        const methodMap: Record<string, LocationMethod> = {
            auto: LocationMethod.AUTO,
            manual: LocationMethod.MANUAL,
        };
        return methodMap[method] || LocationMethod.MANUAL;
    }

    private mapLocationType(type: string): LocationType {
        const typeMap: Record<string, LocationType> = {
            gps: LocationType.GPS,
            network: LocationType.NETWORK,
            manual: LocationType.MANUAL,
        };
        return typeMap[type] || LocationType.MANUAL;
    }

    private mapReportType(reportType: string): ReportType {
        const typeMap: Record<string, ReportType> = {
            abi: ReportType.ABI,
            zob: ReportType.ZOB,
            cpo: ReportType.CPO,
            cps: ReportType.CPS,
            other: ReportType.OTHER,
        };

        const normalizedType = reportType.toLowerCase().trim();
        return typeMap[normalizedType] || ReportType.OTHER;
    }

    private mapOperators(operators: string[]): TelecomOperator[] {
        if (!operators || !Array.isArray(operators)) {
        return [];
    }
    
    return operators.map((operator) => {
        const operatorMap: Record<string, TelecomOperator> = {
            mtn: TelecomOperator.MTN,
            orange: TelecomOperator.ORANGE,
            moov: TelecomOperator.MOOV,
        };
        return operatorMap[operator.toLowerCase()] || TelecomOperator.MTN;
    });
    }

    private mapMedia(dto: DetailsItemDto): ReportMedia {
        return {
            placePhoto: dto.place_photo,
            accessPlacePhoto: dto.access_place_photo,
        };
    }

    private mapTreaterInfo(dto: DetailsItemDto): TreaterInfo {
        return {
            acknowledgedAt: dto.acknowledged_at,
            createdAt: dto.created_at,
            reportedAt: dto.reported_at,
            approvedAt: dto.approved_at,
            finalizedAt: dto.finalized_at,
            rejectedAt: dto.rejected_at,
            confirmedAt: dto.confirmed_at,
            abandonedAt: dto.abandoned_at,
            acknowledgedComment: dto.acknowledged_comment,
            approvedComment: dto.approved_comment,
            rejectedComment: dto.rejected_comment,
            confirmedComment: dto.confirmed_comment,
            abandonedComment: dto.abandoned_comment,
            confirmCount: dto.confirm_count,
            denyCount: dto.deny_count,
            reason: dto.reason,
        };
    }

    private mapReportStatus(status: string): ReportStatus {
        const statusMap: Record<string, ReportStatus> = {
            pending: ReportStatus.PENDING,
            approved: ReportStatus.APPROVED,
            rejected: ReportStatus.REJECTED,
            abandoned: ReportStatus.ABANDONED,
            confirmed: ReportStatus.CONFIRM,
            terminated: ReportStatus.TERMINATED,
            'in-progress': ReportStatus['IN-PROGRESS'],
            processing: ReportStatus.PROCESSING,
            finalization: ReportStatus.FINALIZATION,
        };
        return statusMap[status] || ReportStatus.PENDING;
    }

    private mapReportState(state: string): ReportState {
        console.log('state', state);
        const stateMap: Record<string, ReportState> = {
            pending: ReportState.PENDING,
            approved: ReportState.APPROVED,
            rejected: ReportState.REJECTED,
            ['in-progress']: ReportState.IN_PROGRESS,
        };
        return stateMap[state] || ReportState.PENDING;
    }

    private mapDuplicationInfo(dto: DetailsItemDto): DuplicationInfo {
        return {
            isDuplicated: dto.is_duplicated,
            duplicateOf: dto.duplicate_of,
        };
    }

    private mapAdministrativeDivision(
        dto: DetailsItemDto
    ): AdministrativeDivision {
        return {
            regionId: dto.region_id,
            departmentId: dto.department_id,
            municipalityId: dto.municipality_id,
            region: dto.region,
            department: dto.department,
            municipality: dto.municipality,
        };
    }

    private mapTimestamps(dto: DetailsItemDto): Timestamps {
        return {
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };
    }
}
