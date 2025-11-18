import { ApiError } from '@shared/domain/errors/api.error';

export abstract class BaseMapper<TEntity, TDto> {
    abstract mapFromDto(dto: TDto): TEntity;
    abstract mapToDto(entity: TEntity): TDto;

    mapArrayFromDto(dtos: TDto[]): TEntity[] {
        return dtos.map((dto) => this.mapFromDto(dto));
    }

    mapArrayToDto(entities: TEntity[]): TDto[] {
        return entities.map((entity) => this.mapToDto(entity));
    }

    protected validateDto(dto: TDto): void {
        if (!dto) {
            throw ApiError.invalidResponse('DTO invalide ou manquant');
        }
    }
}
