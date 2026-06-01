import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { MessageEntity } from '@shared/domain/entities/message.entity';
import { ApiError } from '@shared/domain/errors/api.error';

export abstract class MessageResponseMapper {
    protected abstract mapItemFromDto(dto: MessageResponseDto): MessageEntity;

    mapFromMessage(dto: MessageResponseDto): MessageEntity {
        this.validateResponse(dto);
        return this.mapItemFromDto(dto);
    }

    private validateResponse(dto: MessageResponseDto): void {
        if (dto.error) {
            throw ApiError.invalidResponse(
                dto.message || 'Erreur API: La requête a échoué.'
            );
        }
    }
}
