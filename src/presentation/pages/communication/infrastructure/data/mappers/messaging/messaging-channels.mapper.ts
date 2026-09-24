import { Injectable } from '@angular/core';
import { MessagingChannelsEnum } from '@pages/communication/domain/enums/messaging/messaging-channels.enum';
import { MessagingChannelsDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-channels.dto';

@Injectable({
    providedIn: 'root',
})
export class MessagingChannelsMapper {
    private readonly entityToDto: Record<string, MessagingChannelsDto> = {
        [MessagingChannelsEnum.PUSH]: MessagingChannelsDto.PUSH,
        [MessagingChannelsEnum.MAIL]: MessagingChannelsDto.MAIL,
        [MessagingChannelsEnum.SMS]: MessagingChannelsDto.SMS,
        [MessagingChannelsEnum.WHATSAPP]: MessagingChannelsDto.WHATSAPP,
        [MessagingChannelsEnum.TELEGRAM]: MessagingChannelsDto.TELEGRAM,
        push: MessagingChannelsDto.PUSH,
        mail: MessagingChannelsDto.MAIL,
        sms: MessagingChannelsDto.SMS,
        whatsapp: MessagingChannelsDto.WHATSAPP,
        telegram: MessagingChannelsDto.TELEGRAM,
    };

    mapFromDto(dto: MessagingChannelsDto): MessagingChannelsEnum {
        const methodMap: Record<MessagingChannelsDto, MessagingChannelsEnum> = {
            [MessagingChannelsDto.PUSH]: MessagingChannelsEnum.PUSH,
            [MessagingChannelsDto.MAIL]: MessagingChannelsEnum.MAIL,
            [MessagingChannelsDto.SMS]: MessagingChannelsEnum.SMS,
            [MessagingChannelsDto.WHATSAPP]: MessagingChannelsEnum.WHATSAPP,
            [MessagingChannelsDto.TELEGRAM]: MessagingChannelsEnum.TELEGRAM,
        };
        return methodMap[dto];
    }
    mapToDto(value: string | MessagingChannelsEnum): MessagingChannelsDto {
        return this.entityToDto[value] ?? MessagingChannelsDto.PUSH;
    }
}
