import { Injectable } from '@angular/core';
import { JobsEntity } from '@pages/reporting/domain/entities/jobs/jobs.entity';
import { JobsItemDto } from '@pages/reporting/infrastructure/api/dto/jobs/jobs-response.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';

@Injectable({ providedIn: 'root' })
export class JobsMapper extends SimpleResponseMapper<JobsEntity, JobsItemDto> {
    protected override mapItemFromDto(dto: JobsItemDto): JobsEntity {
        return new JobsEntity(dto.impactJobs);
    }
}
