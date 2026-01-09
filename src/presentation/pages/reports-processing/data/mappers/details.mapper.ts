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
import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';
import {
    DetailsEntity,
    FinalizationState,
    ProcessingState,
    QualificationState,
    ReportState,
    ReportStatus,
} from '../../domain/entities/details/details.entity';
import { DetailsItemDto } from '../dtos/details/details-response.dto';

/* const REPORT_STATUS_MAP: Readonly<Record<string, ReportStatus>> = {
    pending: ReportStatus.PENDING,
    approved: ReportStatus.APPROVED,
    rejected: ReportStatus.REJECTED,
    abandoned: ReportStatus.ABANDONED,
    confirmed: ReportStatus.CONFIRM,
    terminated: ReportStatus.TERMINATED,
    'in-progress': ReportStatus.IN_PROGRESS,
    processing: ReportStatus.PROCESSING,
    finalization: ReportStatus.FINALIZATION,
} as const;

function mapReportStatus(status: string): ReportStatus {
    return REPORT_STATUS_MAP[status] || ReportStatus.PENDING;
}

const REPORT_STATE_MAP: Readonly<Record<string, ReportState>> = {
    pending: ReportState.PENDING,
    approved: ReportState.APPROVED,
    rejected: ReportState.REJECTED,
    'in-progress': ReportState.IN_PROGRESS,
    completed: ReportState.COMPLETED,
    terminated: ReportState.TERMINATED,
} as const;

function mapReportState(state: string): ReportState {
    return REPORT_STATE_MAP[state] || ReportState.PENDING;
}

const QUALIFICATION_STATE_MAP: Readonly<Record<string, QualificationState>> = {
    completed: QualificationState.COMPLETED,
} as const;

function mapQualificationState(state: string | null): QualificationState | null {
    if (!state) return null;
    return QUALIFICATION_STATE_MAP[state] || null;
} */

export class DetailsMapper extends SimpleResponseMapper<
    DetailsEntity,
    DetailsItemDto
> {

    private readonly utils = new MapperUtils();

    private readonly entityCache = new Map<string, DetailsEntity>();

    private readonly actorMapper = inject(ActorMapper);
    private readonly reportSourceMapper = inject(ReportSourceMapper);
    private readonly locationTypeMapper = inject(LocationTypeMapper);
    private readonly reportTypeMapper = inject(ReportTypeMapper);
    private readonly locationMapper = inject(LocationMapper);
    private readonly telecomOperatorMapper = inject(TelecomOperatorMapper);
    private readonly reportMediaMapper = inject(ReportMediaMapper);
    private readonly treaterInfoMapper = inject(TreaterInfoMapper);
    private readonly administrativeBoundaryMapper = inject(AdministrativeBoundaryMapper);
    private readonly timestampsMapper = inject(TimestampsMapper);

    private static readonly STATUS_MAP = MapperUtils.createEnumMap({
        pending: ReportStatus.PENDING,
        approved: ReportStatus.APPROVED,
        rejected: ReportStatus.REJECTED,
        abandoned: ReportStatus.ABANDONED,
        confirmed: ReportStatus.CONFIRM,
        terminated: ReportStatus.TERMINATED,
        'in-progress': ReportStatus.IN_PROGRESS,
        processing: ReportStatus.PROCESSING,
        finalization: ReportStatus.FINALIZATION,
    });

    private static readonly STATE_MAP = MapperUtils.createEnumMap({
        pending: ReportState.PENDING,
        approved: ReportState.APPROVED,
        rejected: ReportState.REJECTED,
        'in-progress': ReportState.IN_PROGRESS,
        completed: ReportState.COMPLETED,
        terminated: ReportState.TERMINATED,
    });

    private static readonly QUALIFICATION_STATE_MAP = MapperUtils.createEnumMap({
        completed: QualificationState.COMPLETED,
    });

    private static readonly PROCESSING_STATE_MAP = MapperUtils.createEnumMap({
        pending: ProcessingState.PENDING,
        'in-progress': ProcessingState.IN_PROGRESS,
    });

    private static readonly FINALIZATION_STATE_MAP = MapperUtils.createEnumMap({
        pending: FinalizationState.PENDING,
        'in-progress': FinalizationState.IN_PROGRESS,
    });

    private clearCache(): void {
        this.entityCache.clear();
        this.utils.clearCache();
    }

    protected override mapItemFromDto(dto: DetailsItemDto): DetailsEntity {

        MapperUtils.validateDto(dto, {
            required: ['uniq_id']
        });

        const cacheKey = `dto:${dto.uniq_id}:${dto.updated_at || dto.created_at}`;
        const cached = this.entityCache.get(cacheKey);
        if (cached) return cached;

        const entity = new DetailsEntity(
            dto.uniq_id,
            dto.request_report_uniq_id,
            dto.initiator_phone_number,
            this.utils.memoized(dto.initiator, i => this.actorMapper.mapToEntity(i)),
            this.utils.memoized(dto.acknowledged_by, a => this.actorMapper.mapToEntity(a)),
            this.utils.memoized(dto.processed_by, p => this.actorMapper.mapToEntity(p)),
            this.utils.memoized(dto.approved_by, a => this.actorMapper.mapToEntity(a)),
            this.utils.memoized(dto.rejected_by, r => this.actorMapper.mapToEntity(r)),
            this.utils.memoized(dto.confirmed_by, c => this.actorMapper.mapToEntity(c)),
            this.utils.memoized(dto.abandoned_by, a => this.actorMapper.mapToEntity(a)),

            this.reportSourceMapper.mapToEnum(dto.source),
            this.locationMapper.mapToEntity(dto),
            this.reportTypeMapper.mapToEnum(dto.report_type),
            this.utils.memoizedList(dto.operators,
                op => this.telecomOperatorMapper.mapToEnum(op),
                op => `telecom:${op}`
            ),
            dto.description,
            this.reportMediaMapper.mapToEntity(dto),
            this.treaterInfoMapper.mapToEntity(dto),

            dto.qualification_state
                ? DetailsMapper.QUALIFICATION_STATE_MAP.get(dto.qualification_state) ?? null
                : null,
            dto.processing_state
                ? DetailsMapper.PROCESSING_STATE_MAP.get(dto.processing_state) ?? null
                : null,
            dto.finalization_state
                ? DetailsMapper.FINALIZATION_STATE_MAP.get(dto.finalization_state) ?? null
                : null,
            DetailsMapper.STATUS_MAP.get(dto.status) ?? ReportStatus.PENDING,
            DetailsMapper.STATE_MAP.get(dto.state) ?? ReportState.PENDING,

            this.utils.memoized(dto.region, r => this.administrativeBoundaryMapper.mapToEntity(r)),
            this.utils.memoized(dto.department, d => this.administrativeBoundaryMapper.mapToEntity(d)),
            this.utils.memoized(dto.municipality, m => this.administrativeBoundaryMapper.mapToEntity(m)),
            this.timestampsMapper.mapToEntity(dto),

            dto.created_at,
            dto.reported_at,
            dto.place_photo,
            dto.access_place_photo,
            dto.confirm_count,
            dto.report_processings_count
        );
        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
