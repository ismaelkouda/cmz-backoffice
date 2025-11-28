/* import { ApiError } from '@shared/domain/errors/api.error';
import { Paginate, PaginatedResponseDto } from '@shared/data/dtos/simple-response.dto';

interface SimplePaginatedResponseDto<TItemDto> {
    error: boolean;
    message: string;
    data: Paginate<TItemDto>;
}

interface SimpleResponseDto<TItemDto> {
    error: boolean;
    message: string;
    data: TItemDto;
}

interface SimpleArrayResponseDto<TItemDto> {
    error: boolean;
    message: string;
    data: TItemDto[];
}

type AllResponseTypes<TItemDto> =
    | SimplePaginatedResponseDto<TItemDto>
    | SimpleResponseDto<TItemDto>
    | SimpleArrayResponseDto<TItemDto>;

export abstract class SimplePaginatedMapper<TEntity, TItemDto> {
    protected abstract mapItemFromDto(dto: TItemDto): TEntity;

    mapFromDto(dto: SimplePaginatedResponseDto<TItemDto>): Paginate<TEntity>;
    mapFromDto(dto: SimpleResponseDto<TItemDto>): TEntity;
    mapFromDto(dto: SimpleArrayResponseDto<TItemDto>): TEntity[];

    mapFromDto(
        dto: AllResponseTypes<TItemDto>
    ): Paginate<TEntity> | TEntity | TEntity[] {
        this.validateResponse(dto);

        if (this.isPaginatedResponse(dto)) {
            const items = dto.data.data ?? [];
            const mappedItems = items.map((item) => this.mapItemFromDto(item));

            return {
                ...dto.data,
                data: mappedItems,
            };
        }

        if (this.isArrayResponse(dto)) {
            return dto.data.map((item) => this.mapItemFromDto(item));
        }

        return this.mapItemFromDto(dto.data);
    }

    private isPaginatedResponse(
        dto: AllResponseTypes<TItemDto>
    ): dto is SimplePaginatedResponseDto<TItemDto> {
        const data = dto.data as any;
        return (
            'data' in dto &&
            dto.data !== null &&
            typeof dto.data === 'object' &&
            'data' in data
        );
    }

    private isArrayResponse(
        dto: AllResponseTypes<TItemDto>
    ): dto is SimpleArrayResponseDto<TItemDto> {
        return 'data' in dto && Array.isArray(dto.data);
    }

    private isSimpleResponse(
        dto: AllResponseTypes<TItemDto>
    ): dto is SimpleResponseDto<TItemDto> {
        return 'data' in dto && Array.isArray(dto.data);
    }

    private validateResponse(dto: AllResponseTypes<TItemDto>): void {
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
 */