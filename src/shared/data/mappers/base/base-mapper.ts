/* import { ApiError } from '@shared/domain/errors/api.error';
import { Paginate } from '@shared/data/dtos/simple-response.dto';

export interface ApiResponseDto<TStatsDto, TItemDto> {
    error: boolean;
    message: string;
    data: Paginate<TStatsDto>;
}

export interface StatsDtoWithPagination<TItemDto> {
    data: Paginate<TItemDto>;
    [key: string]: unknown;
}

export abstract class BaseMapper<
    TEntity,
    TItemDto,
    TStatsDto extends StatsDtoWithPagination<TItemDto>,
    TResponseDto extends ApiResponseDto<TStatsDto, TItemDto>,
> {
    protected abstract mapItemFromDto(dto: TItemDto): TEntity;

    mapFromDto(dto: TResponseDto): Paginate<TEntity> {
        this.validateResponse(dto);

        const statsData = this.extractStatsData(dto);
        const items = this.mapItems(statsData);

        return this.buildPagination(statsData, items);
    }

    protected validateResponse(dto: TResponseDto): void {
        if (dto.error || !dto.data) {
            throw ApiError.invalidResponse(
                dto.message ||
                    "Erreur lors de la récupération des données depuis l'API"
            );
        }
    }

    protected extractStatsData(dto: TResponseDto): TStatsDto {
        const statsArray = dto.data.data;

        if (!statsArray || statsArray.length === 0) {
            throw ApiError.invalidResponse(
                'Aucune donnée de statistiques trouvée dans la réponse API'
            );
        }

        return statsArray[0];
    }

    protected mapItems(statsData: TStatsDto): TEntity[] {
        const itemsData = statsData.data?.data;

        if (!itemsData || !Array.isArray(itemsData)) {
            throw ApiError.mappingFailed(
                'items',
                new Error("Les données d'items ne sont pas valides")
            );
        }

        return itemsData.map((item: TItemDto) => this.mapItemFromDto(item));
    }

    protected buildPagination(
        statsData: TStatsDto,
        items: TEntity[]
    ): Paginate<TEntity> {
        return {
            ...statsData.data,
            data: items,
        };
    }
}
 */
