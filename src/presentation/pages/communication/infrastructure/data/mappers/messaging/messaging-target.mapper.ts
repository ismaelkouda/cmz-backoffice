import { Injectable } from '@angular/core';
import { MessagingTargetEnum } from '@pages/communication/domain/enums/messaging/messaging-target.enum';
import { MessagingTargetDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-target.dto';

@Injectable({
    providedIn: 'root',
})
export class MessagingTargetMapper {
    private readonly dtoToEntity: Record<
        MessagingTargetDto,
        MessagingTargetEnum
    > = {
        [MessagingTargetDto.REPORT]: MessagingTargetEnum.REPORT,
        [MessagingTargetDto.AREA]: MessagingTargetEnum.AREA,
    };

    private readonly entityToDto: Record<
        MessagingTargetEnum,
        MessagingTargetDto
    > = {
        [MessagingTargetEnum.REPORT]: MessagingTargetDto.REPORT,
        [MessagingTargetEnum.AREA]: MessagingTargetDto.AREA,
    };

    mapFromDto(dtoValue: MessagingTargetDto): MessagingTargetEnum {
        return this.dtoToEntity[dtoValue];
    }

    mapToDto(enumValue: MessagingTargetEnum): MessagingTargetDto {
        return this.entityToDto[enumValue] ?? MessagingTargetDto.REPORT;
    }
}
