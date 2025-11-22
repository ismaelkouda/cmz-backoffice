import { Injectable } from '@angular/core';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { QueuesEntity } from '../../domain/entities/queues/queues.entity';
import { QueuesItemDto } from '../dtos/queues/queues-response.dto';

@Injectable({
    providedIn: 'root',
})
export class QueuesMapper extends PaginatedMapper<QueuesEntity, QueuesItemDto> {
    protected override mapItemFromDto(dto: QueuesItemDto): QueuesEntity {
        const parseNumber = (value: string | null): number | null => {
            if (value === null || value === undefined || value === '') {
                return null;
            }
            const parsed = Number(value);
            return Number.isNaN(parsed) ? null : parsed;
        };

        const parseOperators = (value: string | string[] | null): string[] => {
            if (Array.isArray(value)) {
                return value;
            }

            if (typeof value === 'string' && value.trim()) {
                try {
                    const parsed = JSON.parse(value);
                    return Array.isArray(parsed)
                        ? parsed.map((operator) => String(operator))
                        : value.split(',').map((operator) => operator.trim());
                } catch {
                    return value.split(',').map((operator) => operator.trim());
                }
            }

            return [];
        };

        const operators = parseOperators(dto.operators);

        return {
            id: dto.id,
            uniqId: dto.uniq_id,
            initiatedBy: dto.initiated_by,
            source: dto.source,
            locationMethod: dto.location_method,
            locationType: dto.location_type,
            locationName: dto.location_name ?? '',
            placeDescription: dto.place_description,
            reportType: dto.report_type,
            operators,
            description: dto.description,
            submissionState: dto.submission_state,
            processingState: dto.processing_state,
            closureState: dto.closure_state,
            status: dto.status,
            state: dto.state,
            voteConfirmCount: dto.vote_confirm_count,
            voteDenyCount: dto.vote_deny_count,
            isDuplicated: dto.is_duplicated,
            duplicateCount: dto.duplicate_count,
            evaluationAverage: dto.evaluation_avg_rating,
            placePhoto: dto.place_photo,
            accessPlacePhoto: dto.access_place_photo,
            latitude: parseNumber(dto.lat),
            longitude: parseNumber(dto.long),
            what3words: dto.what3words,
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };
    }
}
