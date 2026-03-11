import { Injectable } from '@angular/core';
import { TelecomOperatorDto } from '@shared/data/dto/telecom-operator.dto';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';

@Injectable({
    providedIn: 'root',
})
export class TelecomOperatorMapper {
    private static readonly MAP = new Map<TelecomOperatorDto, TelecomOperator>([
        [TelecomOperatorDto.MTN, TelecomOperator.MTN],
        [TelecomOperatorDto.ORANGE, TelecomOperator.ORANGE],
        [TelecomOperatorDto.MOOV, TelecomOperator.MOOV],
    ]);

    mapToEnum(dto: TelecomOperatorDto): TelecomOperator {
        return TelecomOperatorMapper.MAP.get(dto) as TelecomOperator;
    }

    mapFromDto(dto: TelecomOperatorDto): TelecomOperator {
        const methodMap: Record<TelecomOperatorDto, TelecomOperator> = {
            [TelecomOperatorDto.MTN]: TelecomOperator.MTN,
            [TelecomOperatorDto.ORANGE]: TelecomOperator.ORANGE,
            [TelecomOperatorDto.MOOV]: TelecomOperator.MOOV,
        };
        return methodMap[dto];
    }
}
