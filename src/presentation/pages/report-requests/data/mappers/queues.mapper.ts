// data/mappers/queues.mapper.ts
import { Injectable } from '@angular/core';
import { QueuesItemDto } from '@presentation/pages/report-requests/data/dtos/queues/queues-response.dto';
import {
    ApprovalInfo,
    Coordinates,
    DuplicationInfo,
    LocationMethod,
    LocationType,
    Queues,
    QueuesEntity,
    ReportLocation,
    ReportMedia,
    ReportSource,
    ReportStatus,
    ReportType,
    TelecomOperator,
} from '@presentation/pages/report-requests/domain/entities/queues/queues.entity';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';

@Injectable({ providedIn: 'root' })
export class QueuesMapper extends PaginatedMapper<QueuesEntity, QueuesItemDto> {
    protected override mapItemFromDto(dto: QueuesItemDto): QueuesEntity {
        return new QueuesEntity(
            dto.id,
            dto.uniq_id,
            dto.initiator_phone_number,
            this.mapSource(dto.source),
            this.mapLocation(dto),
            this.mapReportType(dto.report_type),
            this.parseOperators(dto.operators),
            this.parseOperators(dto.cumulative_operators),
            dto.description,
            this.mapMedia(dto),
            this.mapApprovalInfo(dto),
            this.mapStatus(dto.status),
            this.mapDuplicationInfo(dto),
            dto.position,
            this.mapTimestamps(dto),
            dto.created_at
        );
    }

    private mapSource(source: string): ReportSource {
        switch (source) {
            case 'app':
                return ReportSource.APP;
            case 'ussd':
                return ReportSource.USSD;
            case 'sms':
                return ReportSource.SMS;
            case 'ivr':
                return ReportSource.IVR;
            default:
                return ReportSource.IVR;
        }
    }

    private mapLocationMethod(method: string): LocationMethod {
        switch (method) {
            case 'auto':
                return LocationMethod.AUTO;
            case 'manual':
                return LocationMethod.MANUAL;
            default:
                return LocationMethod.AUTO;
        }
    }

    private mapLocationType(type: string): LocationType {
        switch (type) {
            case 'gps':
                return LocationType.GPS;
            case 'network':
                return LocationType.NETWORK;
            case 'manual':
                return LocationType.MANUAL;
            default:
                return LocationType.GPS;
        }
    }

    private mapReportType(type: string): ReportType {
        switch (type) {
            case 'abi':
                return ReportType.ABI;
            case 'zob':
                return ReportType.ZOB;
            case 'abi':
                return ReportType.CPO;
            case 'zob':
                return ReportType.ZOB;
            default:
                return ReportType.OTHER;
        }
    }

    private mapStatus(status: string): ReportStatus {
        switch (status) {
            case 'pending':
                return ReportStatus.PENDING;
            case 'approved':
                return ReportStatus.APPROVED;
            case 'rejected':
                return ReportStatus.REJECTED;
            default:
                return ReportStatus.PENDING;
        }
    }

    private parseOperators(operatorsString: string): TelecomOperator[] {
        try {
            const operatorsArray = JSON.parse(operatorsString) as string[];
            return operatorsArray.map((operator) => this.mapOperator(operator));
        } catch (error) {
            console.warn('Failed to parse operators JSON:', operatorsString);
            return [];
        }
    }

    private mapOperator(operator: string): TelecomOperator {
        switch (operator) {
            case 'mtn':
                return TelecomOperator.MTN;
            case 'orange':
                return TelecomOperator.ORANGE;
            case 'moov':
                return TelecomOperator.MOOV;
            default:
                return TelecomOperator.ORANGE;
        }
    }

    private parseCoordinate(value: string): number {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? 0 : parsed;
    }

    private mapLocation(dto: QueuesItemDto): ReportLocation {
        const coordinates: Coordinates = {
            latitude: this.parseCoordinate(dto.lat),
            longitude: this.parseCoordinate(dto.long),
            what3words: dto.what3words,
        };

        return {
            coordinates,
            method: this.mapLocationMethod(dto.location_method),
            type: this.mapLocationType(dto.location_type),
            name: dto.location_name,
            description: dto.place_description,
        };
    }

    private mapMedia(dto: QueuesItemDto): ReportMedia {
        return {
            placePhoto: dto.place_photo,
            accessPlacePhoto: dto.access_place_photo,
        };
    }

    private mapApprovalInfo(dto: QueuesItemDto): ApprovalInfo {
        return {
            approvedBy: dto.approved_by,
            approvedAt: dto.approved_at,
            rejectedBy: dto.rejected_by,
            rejectedAt: dto.rejected_at,
            approvedComment: dto.approved_comment,
            confirmCount: dto.confirm_count,
            denyCount: dto.deny_count,
        };
    }

    private mapDuplicationInfo(dto: QueuesItemDto): DuplicationInfo {
        return {
            isDuplicated: dto.is_duplicated,
            duplicateOf: dto.duplicate_of,
        };
    }

    private mapTimestamps(dto: QueuesItemDto): Queues['timestamps'] {
        return {
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };
    }
}
