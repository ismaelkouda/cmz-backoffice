import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { ApiError } from '@shared/domain/errors/api.error';

export interface SimplePaginatedResponseDto<TItemDto> {
    error: boolean;
    message: string;
    data: Paginate<TItemDto>;
}

export abstract class SimplePaginatedMapper<
    TEntity,
    TItemDto,
    TResponseDto extends SimplePaginatedResponseDto<TItemDto>,
> {
    protected abstract mapItemFromDto(dto: TItemDto): TEntity;

    mapFromDto(dto: TResponseDto): Paginate<TEntity> {
        this.validateResponse(dto);

        const items = dto.data?.data ?? [];
        const mappedItems = items.map((item) => this.mapItemFromDto(item));

        return {
            ...dto.data,
            data: mappedItems,
        };
    }

    private validateResponse(dto: TResponseDto): void {
        if (dto.error || !dto.data) {
            throw ApiError.invalidResponse(
                dto.message ||
                    "Erreur lors de la récupération des données depuis l'API."
            );
        }
    }
}
