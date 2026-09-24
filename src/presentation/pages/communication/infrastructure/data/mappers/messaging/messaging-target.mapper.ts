import { Injectable } from '@angular/core';
import { MessagingTargetEnum } from '@pages/communication/domain/enums/messaging/messaging-target.enum';
import { MessagingTargetDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-target.dto';

@Injectable({
    providedIn: 'root',
})
export class MessagingTargetMapper {
    private readonly entityToDto: Record<string, MessagingTargetDto> = {
        [MessagingTargetEnum.REPORT]: MessagingTargetDto.REPORT,
        [MessagingTargetEnum.AREA]: MessagingTargetDto.AREA,
        report: MessagingTargetDto.REPORT,
        area: MessagingTargetDto.AREA,
    };

    mapFromDto(dtoValue: MessagingTargetDto): MessagingTargetEnum {
        if (dtoValue === MessagingTargetDto.REPORT) {
            return MessagingTargetEnum.REPORT;
        }
        if (dtoValue === MessagingTargetDto.AREA) {
            return MessagingTargetEnum.AREA;
        }
        return MessagingTargetEnum.REPORT;
    }

    mapToDto(enumValue: string | MessagingTargetEnum): MessagingTargetDto {
        return this.entityToDto[enumValue] ?? MessagingTargetDto.REPORT;
    }
}
