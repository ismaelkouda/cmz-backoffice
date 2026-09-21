import { ReportNewspaperFilterEntity } from '@shared/components/report-newspaper/domain/entities/report-newspaper-filter.entity';
import { ReportNewspaperFilterApiDto } from '@shared/components/report-newspaper/infrastructure/api/dto/report-newspaper-filter-api.dto';

export function reportNewspaperFilterMapper(
    entity: ReportNewspaperFilterEntity
): ReportNewspaperFilterApiDto {
    const params: ReportNewspaperFilterApiDto =
        {} as ReportNewspaperFilterApiDto;

    if (entity.uniqId) {
        params.uniq_id = entity.uniqId;
    }

    return params;
}
