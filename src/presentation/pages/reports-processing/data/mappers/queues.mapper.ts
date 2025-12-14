import { inject, Injectable } from '@angular/core';
import { QueuesItemDto } from '@presentation/pages/reports-processing/data/dtos/queues/queues-response.dto';
import {
    QueuesEntity
} from '@presentation/pages/reports-processing/domain/entities/queues/queues.entity';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { ReportSourceMapper } from '@shared/data/mappers/report-source.mapper';
import { ReportTypeMapper } from '@shared/data/mappers/report-type.mapper';
import { TelecomOperatorMapper } from '@shared/data/mappers/telecom-operator.mapper';

@Injectable({ providedIn: 'root' })

export class QueuesMapper extends PaginatedMapper<QueuesEntity, QueuesItemDto> {
    reportTypeMapper = inject(ReportTypeMapper)
    telecomOperatorMapper = inject(TelecomOperatorMapper)
    reportSourceMapper = inject(ReportSourceMapper)

    protected override mapItemFromDto(dto: QueuesItemDto): QueuesEntity {
        return new QueuesEntity(
            dto.uniq_id,
            this.reportTypeMapper.mapToEnum(dto.report_type),
            this.telecomOperatorMapper.mapToEnum(dto.operators),
            this.reportSourceMapper.mapToEnum(dto.source),
            dto.initiator_phone_number,
            dto.created_at,
        );
    }
}
