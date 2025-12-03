import { Injectable } from '@angular/core';
import { AllItemDto, ReportStatusDto } from '@presentation/pages/report-requests/data/dtos/all/all-response.dto';
import {
    All,
    AllEntity,
    ReportStatus,
} from '@presentation/pages/report-requests/domain/entities/all/all.entity';
import { ReportSourceDto } from '@shared/data/dtos/report-source.dto';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { LocationMethod } from '@shared/domain/enums/location-method.enum';
import { LocationType } from '@shared/domain/enums/location-type.enum';
import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';
import { ApprovalInfo } from '@shared/domain/interfaces/approval-info.interface';
import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';
import { DuplicationInfo } from '@shared/domain/interfaces/duplication-info.interface';
import { ReportLocation } from '@shared/domain/interfaces/report-location.interface';
import { ReportMedia } from '@shared/domain/interfaces/report-media.interface';

@Injectable({ providedIn: 'root' })
export class AllMapper extends PaginatedMapper<AllEntity, AllItemDto> {
    protected override mapItemFromDto(dto: AllItemDto): AllEntity {
        return new AllEntity(
            dto.id,
            dto.uniq_id,
            dto.initiator_phone_number,
            this.mapSource(dto.source),
            this.mapLocation(dto),
            this.mapReportType(dto.report_type),
            this.parseOperators(dto.operators),
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

    private mapSource(source: ReportSourceDto): ReportSource {
        switch (source) {
            case ReportSourceDto.APP:
                return ReportSource.APP;
            case ReportSourceDto.USSD:
                return ReportSource.USSD;
            case ReportSourceDto.SMS:
                return ReportSource.SMS;
            case ReportSourceDto.IVR:
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
            case 'cpo':
                return ReportType.CPO;
            case 'cps':
                return ReportType.CPS;
            default:
                return ReportType.OTHER;
        }
    }

    private mapStatus(status: ReportStatusDto): ReportStatus {
        switch (status) {
            case ReportStatusDto.CONFIRMED:
                return ReportStatus.CONFIRMED;
            case ReportStatusDto.APPROVED:
                return ReportStatus.APPROVED;
            case ReportStatusDto.REJECTED:
                return ReportStatus.REJECTED;
            case ReportStatusDto.ABANDONED:
                return ReportStatus.ABANDONED;
            default:
                return ReportStatus.ABANDONED;
        }
    }

    private parseOperators(operatorsString: string): TelecomOperator[] {
        if (!operatorsString) {
            return [];
        }
        const operatorsArray = JSON.parse(operatorsString) as string[];
        return operatorsArray.map((operator) => this.mapOperator(operator));
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
        const parsed = Number.parseFloat(value);
        return Number.isNaN(parsed) ? 0 : parsed;
    }

    private mapLocation(dto: AllItemDto): ReportLocation {
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

    private mapMedia(dto: AllItemDto): ReportMedia {
        return {
            placePhoto: dto.place_photo,
            accessPlacePhoto: dto.access_place_photo,
        };
    }

    private mapApprovalInfo(dto: AllItemDto): ApprovalInfo {
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

    private mapDuplicationInfo(dto: AllItemDto): DuplicationInfo {
        return {
            isDuplicated: dto.is_duplicated,
            duplicateOf: dto.duplicate_of,
        };
    }

    private mapTimestamps(dto: AllItemDto): All['timestamps'] {
        return {
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };
    }
}
