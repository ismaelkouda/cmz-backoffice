import { inject } from '@angular/core';
import { ActorMapper } from '@shared/data/mappers/actor.mapper';
import { AdministrativeBoundaryMapper } from '@shared/data/mappers/administrative-boundary.mapper';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { LocationTypeMapper } from '@shared/data/mappers/location-type.mapper';
import { LocationMapper } from '@shared/data/mappers/location.mapper';
import { ReportMediaMapper } from '@shared/data/mappers/report-media.mapper';
import { ReportSourceMapper } from '@shared/data/mappers/report-source.mapper';
import { ReportTypeMapper } from '@shared/data/mappers/report-type.mapper';
import { TelecomOperatorMapper } from '@shared/data/mappers/telecom-operator.mapper';
import { TimestampsMapper } from '@shared/data/mappers/timestamps.mapper';
import { TreaterInfoMapper } from '@shared/data/mappers/treater-info.mapper';
import {
    DetailsEntity,
    QualificationState,
    ReportState,
    ReportStatus,
} from '../../domain/entities/details/details.entity';
import { DetailsItemDto } from '../dtos/details/details-response.dto';

export class DetailsMapper extends SimpleResponseMapper<
    DetailsEntity,
    DetailsItemDto
> {
    actorMapper = inject(ActorMapper);
    reportSourceMapper = inject(ReportSourceMapper);
    locationTypeMapper = inject(LocationTypeMapper);
    reportTypeMapper = inject(ReportTypeMapper);
    locationMapper = inject(LocationMapper);
    telecomOperatorMapper = inject(TelecomOperatorMapper);
    reportMediaMapper = inject(ReportMediaMapper);
    treaterInfoMapper = inject(TreaterInfoMapper);
    administrativeBoundaryMapper = inject(AdministrativeBoundaryMapper);
    timestampsMapper = inject(TimestampsMapper);

    protected override mapItemFromDto(dto: DetailsItemDto): DetailsEntity {
        return new DetailsEntity(
            dto.id,
            dto.uniq_id,
            dto.request_report_uniq_id,
            dto.initiator_phone_number,
            this.actorMapper.mapToEntity(dto.initiator),
            this.actorMapper.mapToEntity(dto.acknowledged_by),
            this.actorMapper.mapToEntity(dto.processed_by),
            this.actorMapper.mapToEntity(dto.approved_by),
            this.actorMapper.mapToEntity(dto.rejected_by),
            this.actorMapper.mapToEntity(dto.confirmed_by),
            this.actorMapper.mapToEntity(dto.abandoned_by),
            this.reportSourceMapper.mapToEnum(dto.source),
            this.locationMapper.mapToEntity(dto),
            this.reportTypeMapper.mapToEnum(dto.report_type),
            this.telecomOperatorMapper.mapToEnum(dto.operators),
            dto.description,
            this.reportMediaMapper.mapToEntity(dto),
            this.treaterInfoMapper.mapToEntity(dto),
            this.mapReportStatus(dto.status),
            this.mapQualificationState(dto.qualification_state),
            this.mapReportState(dto.state),
            this.administrativeBoundaryMapper.mapToEntity(dto.region),
            this.administrativeBoundaryMapper.mapToEntity(dto.department),
            this.administrativeBoundaryMapper.mapToEntity(dto.municipality),
            this.timestampsMapper.mapToEntity(dto),
            dto.created_at,
            dto.reported_at,
            dto.place_photo,
            dto.access_place_photo,
            dto.confirm_count,
            dto.report_processings_count
        );
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

    private mapQualificationState(
        state: string | null
    ): QualificationState | null {
        const stateMap: Record<string, QualificationState> = {
            completed: QualificationState.COMPLETED,
        };
        return stateMap[state || ''] || null;
    }

    private mapReportState(state: string): ReportState {
        const stateMap: Record<string, ReportState> = {
            pending: ReportState.PENDING,
            approved: ReportState.APPROVED,
            rejected: ReportState.REJECTED,
            ['in-progress']: ReportState.IN_PROGRESS,
            completed: ReportState.COMPLETED,
            terminated: ReportState.TERMINATED,
        };
        return stateMap[state] || ReportState.PENDING;
    }
}
