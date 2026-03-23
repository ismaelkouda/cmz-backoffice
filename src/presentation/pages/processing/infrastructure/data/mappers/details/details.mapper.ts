import { inject, Injectable } from '@angular/core';
import { DetailsEntity } from '@pages/processing/domain/entities/details/details.entity';
import { DetailsStatus } from '@pages/processing/domain/enums/details/details-status/details-status.enum';
import { DetailsProps } from '@pages/processing/domain/interfaces/details/details-props.interface';
import { DetailsItemApiDto } from '@pages/processing/infrastructure/api/dto/details/details-response-api.dto';
import { ProcessingStateMapper } from '@pages/processing/infrastructure/data/mappers/details/details-processing-state.mapper';
import { StateMapper } from '@pages/processing/infrastructure/data/mappers/details/details-state.mapper';
import { ActorMapper } from '@shared/data/mappers/actor.mapper';
import { AdministrativeBoundaryMapper } from '@shared/data/mappers/administrative-boundary.mapper';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { LocationMapper } from '@shared/data/mappers/location.mapper';
import { ReportMediaMapper } from '@shared/data/mappers/report-media.mapper';
import { ReportSourceMapper } from '@shared/data/mappers/report-source.mapper';
import { ReportTypeMapper } from '@shared/data/mappers/report-type.mapper';
import { TelecomOperatorMapper } from '@shared/data/mappers/telecom-operator.mapper';
import { TimestampsMapper } from '@shared/data/mappers/timestamps.mapper';
import { TreaterInfoMapper } from '@shared/data/mappers/treater-info.mapper';
import { TypeReport } from '@shared/domain/enums/type-report.enum';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class DetailsMapper extends SimpleResponseMapper<
    DetailsEntity,
    DetailsItemApiDto
> {
    private readonly utils = new MapperUtils();
    private readonly entityCache = new Map<string, DetailsEntity>();
    private readonly actorMapper = inject(ActorMapper);
    private readonly reportSourceMapper = inject(ReportSourceMapper);
    private readonly reportTypeMapper = inject(ReportTypeMapper);
    private readonly locationMapper = inject(LocationMapper);
    private readonly telecomOperatorMapper = inject(TelecomOperatorMapper);
    private readonly reportMediaMapper = inject(ReportMediaMapper);
    private readonly treaterInfoMapper = inject(TreaterInfoMapper);
    private readonly administrativeBoundaryMapper = inject(
        AdministrativeBoundaryMapper
    );
    private readonly timestampsMapper = inject(TimestampsMapper);
    private readonly stateMapper = inject(StateMapper);
    private readonly processingStateMapper = inject(ProcessingStateMapper);

    private static readonly STATUS_MAP = MapperUtils.createEnumMap({
        pending: DetailsStatus.PENDING,
        terminated: DetailsStatus.TERMINATED,
        'in-progress': DetailsStatus.IN_PROGRESS,
    });

    protected mapItemFromDto(dto: DetailsItemApiDto): DetailsEntity {
        MapperUtils.validateDto(dto, { required: ['uniq_id'] });

        const props: DetailsProps = {
            type: TypeReport.PROCESSING,
            uniqId: dto.uniq_id,
            reportUniqId: dto.request_report_uniq_id,
            initiatorPhone: dto.initiator_phone_number,
            initiator: this.utils.memoized(dto.initiator, (i) =>
                this.actorMapper.mapToEntity(i)
            ),
            acknowledgedBy: this.utils.memoized(dto.acknowledged_by, (a) =>
                this.actorMapper.mapToEntity(a)
            ),
            processedBy: this.utils.memoized(dto.processed_by, (p) =>
                this.actorMapper.mapToEntity(p)
            ),
            approvedBy: this.utils.memoized(dto.approved_by, (a) =>
                this.actorMapper.mapToEntity(a)
            ),
            rejectedBy: this.utils.memoized(dto.rejected_by, (r) =>
                this.actorMapper.mapToEntity(r)
            ),
            confirmedBy: this.utils.memoized(dto.confirmed_by, (c) =>
                this.actorMapper.mapToEntity(c)
            ),
            abandonedBy: this.utils.memoized(dto.abandoned_by, (a) =>
                this.actorMapper.mapToEntity(a)
            ),
            source: this.reportSourceMapper.mapToEnum(dto.source),
            location: this.locationMapper.mapToEntity(dto),
            reportType: this.reportTypeMapper.mapToEnum(dto.report_type),
            operators: this.utils.memoizedList(
                dto.operators,
                (op) => this.telecomOperatorMapper.mapToEnum(op),
                (op) => `telecom:${op}`
            ),
            description: dto.description,
            media: this.reportMediaMapper.mapToEntity(dto),
            treater: this.treaterInfoMapper.mapToEntity(dto),
            status:
                DetailsMapper.STATUS_MAP.get(dto.status) ??
                DetailsStatus.PENDING,
            processingState: this.processingStateMapper.mapApiToProcessingState(
                dto.processing_state
            ),
            state: this.stateMapper.mapApiToState(dto.state),

            region: this.utils.memoized(dto.region, (r) =>
                this.administrativeBoundaryMapper.mapToEntity(r)
            ),
            department: this.utils.memoized(dto.department, (d) =>
                this.administrativeBoundaryMapper.mapToEntity(d)
            ),
            municipality: this.utils.memoized(dto.municipality, (m) =>
                this.administrativeBoundaryMapper.mapToEntity(m)
            ),
            timestamps: this.timestampsMapper.mapToEntity(dto),
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
            reportedAt: dto.reported_at,
            placePhoto: dto.place_photo,
            accessPlacePhoto: dto.access_place_photo,
            confirmCount: dto.confirm_count,
        };

        const cacheKey = `dto:${dto.uniq_id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(props) : new DetailsEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
