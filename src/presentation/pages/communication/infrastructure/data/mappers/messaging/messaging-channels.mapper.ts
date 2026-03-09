import { Injectable } from '@angular/core';

import { Channels } from '@presentation/pages/communication/domain/enums/messaging/messaging-channels.enum';
import { ChannelsDto } from '@presentation/pages/communication/infrastructure/api/dto/messaging/messaging-channels.dto';

@Injectable({
    providedIn: 'root',
})
export class ChannelsMapper {
    mapFromDto(dto: ChannelsDto): Channels {
        const methodMap: Record<ChannelsDto, Channels> = {
            [ChannelsDto.PUSH]: Channels.PUSH,
            [ChannelsDto.MAIL]: Channels.MAIL,
            [ChannelsDto.SMS]: Channels.SMS,
        };
        return methodMap[dto];
    }
    mapToDto(value: Channels): ChannelsDto {
        const methodMap: Record<Channels, ChannelsDto> = {
            [Channels.PUSH]: ChannelsDto.PUSH,
            [Channels.MAIL]: ChannelsDto.MAIL,
            [Channels.SMS]: ChannelsDto.SMS,
        };
        return methodMap[value];
    }
}
