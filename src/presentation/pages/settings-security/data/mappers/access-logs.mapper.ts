/* import { Injectable } from '@angular/core';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { AccessLogsEntity } from '../../domain/entities/access-logs/access-logs.entity';
import { AccessLogsItemDto } from '../dtos/access-logs-response.dto';

@Injectable({ providedIn: 'root' })
export class AccessLogsMapper extends PaginatedMapper<
    AccessLogsEntity,
    AccessLogsItemDto
> {
    protected mapItemFromDto(dto: AccessLogsItemDto): AccessLogsEntity {
        let parsedData: any = {};
        try {
            parsedData = JSON.parse(dto.data);
        } catch (e) {
            // console.error('Error parsing access log data', e);
        }

        return new AccessLogsEntity(
            dto.id,
            dto.created_at,
            dto.event,
            dto.action,
            dto.ip,
            parsedData['username'] || 'N/A',
            parsedData
        );
    }
}
 */