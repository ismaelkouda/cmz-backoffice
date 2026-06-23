import { Injectable } from '@angular/core';
import { MessagingTypeEnum } from '@pages/communication/domain/enums/messaging/messaging-type.enum';
import { MessagingTypeDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-type.dto';

@Injectable({
    providedIn: 'root',
})
export class MessagingTypeMapper {
    private readonly dtoToEntity: Record<MessagingTypeDto, MessagingTypeEnum> =
        {
            [MessagingTypeDto.AWARENESS]: MessagingTypeEnum.AWARENESS,
        };

    private readonly entityToDto: Record<MessagingTypeEnum, MessagingTypeDto> =
        {
            [MessagingTypeEnum.AWARENESS]: MessagingTypeDto.AWARENESS,
        };

    mapFromDto(dtoValue: MessagingTypeDto): MessagingTypeEnum {
        return this.dtoToEntity[dtoValue];
    }

    mapToDto(enumValue: MessagingTypeEnum): MessagingTypeDto {
        return this.entityToDto[enumValue] ?? MessagingTypeDto.AWARENESS;
    }
}
