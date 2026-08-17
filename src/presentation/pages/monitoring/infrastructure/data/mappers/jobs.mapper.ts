import { Injectable } from '@angular/core';
import { JobsEntity } from '@presentation/pages/monitoring/domain/entities/jobs/jobs.entity';
import { JobsItemDto } from '@presentation/pages/monitoring/infrastructure/api/dto/jobs/jobs-response.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';

@Injectable({ providedIn: 'root' })
export class JobsMapper extends SimpleResponseMapper<JobsEntity, JobsItemDto> {
    protected override mapItemFromDto(dto: JobsItemDto): JobsEntity {
        console.log('dto impactJobs: ', dto);
        return new JobsEntity(dto.impactJobs);
    }
}
