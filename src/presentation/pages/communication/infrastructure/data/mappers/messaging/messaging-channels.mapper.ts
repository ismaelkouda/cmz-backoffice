import { Injectable } from '@angular/core';
import { MessagingChannelsEnum } from '@pages/communication/domain/enums/messaging/messaging-channels.enum';
import { MessagingChannelsDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-channels.dto';

@Injectable({
    providedIn: 'root',
})
export class MessagingChannelsMapper {
    mapFromDto(dto: MessagingChannelsDto): MessagingChannelsEnum {
        const methodMap: Record<MessagingChannelsDto, MessagingChannelsEnum> = {
            [MessagingChannelsDto.PUSH]: MessagingChannelsEnum.PUSH,
            [MessagingChannelsDto.MAIL]: MessagingChannelsEnum.MAIL,
            [MessagingChannelsDto.SMS]: MessagingChannelsEnum.SMS,
        };
        return methodMap[dto];
    }
    mapToDto(value: MessagingChannelsEnum): MessagingChannelsDto {
        const methodMap: Record<MessagingChannelsEnum, MessagingChannelsDto> = {
            [MessagingChannelsEnum.PUSH]: MessagingChannelsDto.PUSH,
            [MessagingChannelsEnum.MAIL]: MessagingChannelsDto.MAIL,
            [MessagingChannelsEnum.SMS]: MessagingChannelsDto.SMS,
        };
        return methodMap[value];
    }
}
