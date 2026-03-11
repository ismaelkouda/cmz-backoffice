import { DashboardFilterEntity } from '@pages/dashboard/domain/entities/dashboard-filter.entity';
import { DashboardFilterApiDto } from '@pages/dashboard/infrastructure/api/dto/dashboard-filter-api.dto';

export function dashboardFilterMapper(
    entity: DashboardFilterEntity
): DashboardFilterApiDto {
    return { period: Number(entity.period) };
}
