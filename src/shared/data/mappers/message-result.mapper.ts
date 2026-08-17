import { Injectable } from '@angular/core';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { MessageResponseMapper } from '@shared/data/mappers/base/message-response.mapper';
import { MessageEntity } from '@shared/domain/entities/message.entity';

@Injectable({ providedIn: 'root' })
export class MessageResultMapper extends MessageResponseMapper {
    protected mapItemFromDto(dto: MessageResponseDto): MessageEntity {
        const props = {
            error: dto.error,
            message: dto.message,
        };
        return new MessageEntity(props);
    }
}
