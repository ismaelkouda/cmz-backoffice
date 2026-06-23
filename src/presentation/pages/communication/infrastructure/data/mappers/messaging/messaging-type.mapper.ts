import { Injectable } from '@angular/core';
import { MessagingTypeEnum } from '@pages/communication/domain/enums/messaging/messaging-type.enum';
import { MessagingTypeDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-type.dto';

@Injectable({
    providedIn: 'root',
})
export class MessagingTypeMapper {
    private readonly dtoToEntity: Record<MessagingTypeDto, MessagingTypeEnum> =
        {
            [MessagingTypeDto.TIP]: MessagingTypeEnum.TIP,
            [MessagingTypeDto.EDUCATION]: MessagingTypeEnum.EDUCATION,
            [MessagingTypeDto.INFO]: MessagingTypeEnum.INFO,
            [MessagingTypeDto.AWARENESS]: MessagingTypeEnum.AWARENESS,
        };

    private readonly entityToDto: Record<MessagingTypeEnum, MessagingTypeDto> =
        {
            [MessagingTypeEnum.TIP]: MessagingTypeDto.TIP,
            [MessagingTypeEnum.EDUCATION]: MessagingTypeDto.EDUCATION,
            [MessagingTypeEnum.INFO]: MessagingTypeDto.INFO,
            [MessagingTypeEnum.AWARENESS]: MessagingTypeDto.AWARENESS,
        };

    mapFromDto(dtoValue: MessagingTypeDto): MessagingTypeEnum {
        return this.dtoToEntity[dtoValue];
    }

    mapToDto(enumValue: MessagingTypeEnum): MessagingTypeDto {
        return this.entityToDto[enumValue];
    }
}
