import { Injectable } from '@angular/core';
import { ReportNewspaperEntity } from '@shared/components/report-newspaper/domain/entities/report-newspaper.entity';
import { ReportNewspaperProps } from '@shared/components/report-newspaper/domain/interfaces/report-newspaper.interface';
import {
    ReportNewspaperItemApiDto,
    ReportNewspaperResponseApiDto,
} from '@shared/components/report-newspaper/infrastructure/api/dto/report-newspaper-response-api.dto';
import { ApiError } from '@shared/domain/errors/api.error';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class ReportNewspaperMapper {
    private readonly entityCache = new Map<string, ReportNewspaperEntity>();

    mapFromDto(dto: ReportNewspaperResponseApiDto): ReportNewspaperEntity[] {
        this.validateResponse(dto);
        return (dto.data ?? [])
            .map((item) => this.mapItemFromDto(item))
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            );
    }

    private mapItemFromDto(
        dto: ReportNewspaperItemApiDto
    ): ReportNewspaperEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const props: ReportNewspaperProps = {
            uniqId: dto.id,
            operation: dto.operation,
            description: dto.description,
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new ReportNewspaperEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }

    private validateResponse(dto: ReportNewspaperResponseApiDto): void {
        if (dto.error) {
            throw ApiError.invalidResponse(
                dto.message || 'Erreur API: La requête a échoué.'
            );
        }

        if (!Array.isArray(dto.data)) {
            throw ApiError.invalidResponse(
                'Erreur API: Aucune donnée reçue dans la réponse.'
            );
        }
    }

    clearCache(): void {
        this.entityCache.clear();
    }
}
