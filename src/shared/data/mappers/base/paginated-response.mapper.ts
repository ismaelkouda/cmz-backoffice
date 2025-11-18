import { ApiError } from '@shared/domain/errors/api.error';
import { Paginate } from '@shared/interfaces/paginate';

interface PaginatedResponseDto<TItemDto> {
    error: boolean;
    message: string;
    data: Paginate<TItemDto>;
}

export abstract class PaginatedMapper<TEntity, TItemDto> {
    protected abstract mapItemFromDto(dto: TItemDto): TEntity;

    mapFromDto(dto: PaginatedResponseDto<TItemDto>): Paginate<TEntity>;

    mapFromDto(dto: PaginatedResponseDto<TItemDto>): Paginate<TEntity> {
        this.validateResponse(dto);

        const items = dto.data.data ?? [];
        const mappedItems = items.map((item) => this.mapItemFromDto(item));

        return {
            ...dto.data,
            data: mappedItems,
        };
    }

    private validateResponse(dto: PaginatedResponseDto<TItemDto>): void {
        if (dto.error) {
            throw ApiError.invalidResponse(
                dto.message || 'Erreur API: La requête a échoué.'
            );
        }

        if (!dto.data) {
            throw ApiError.invalidResponse(
                'Erreur API: Aucune donnée reçue dans la réponse.'
            );
        }
    }
}
