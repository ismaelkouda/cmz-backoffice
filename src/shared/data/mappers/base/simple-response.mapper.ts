import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { ApiError } from '@shared/domain/errors/api.error';

export abstract class SimpleResponseMapper<TEntity, TItemDto> {
    protected abstract mapItemFromDto(dto: TItemDto): TEntity;

    mapFromDto(dto: SimpleResponseDto<TItemDto>): TEntity {
        this.validateResponse(dto);
        return this.mapItemFromDto(dto.data);
    }

    private validateResponse(dto: SimpleResponseDto<TItemDto>): void {
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
