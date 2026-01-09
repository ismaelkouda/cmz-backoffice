import { Injectable } from '@angular/core';
import { TelecomOperatorDto } from '@shared/data/dtos/telecom-operator.dto';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';

@Injectable({
    providedIn: 'root',
})
export class TelecomOperatorMapper {
    private static readonly MAP = new Map<TelecomOperatorDto, TelecomOperator>([
        [TelecomOperatorDto.MTN, TelecomOperator.MTN],
        [TelecomOperatorDto.ORANGE, TelecomOperator.ORANGE],
        [TelecomOperatorDto.MOOV, TelecomOperator.MOOV],
        [TelecomOperatorDto.UNKNOWN, TelecomOperator.UNKNOWN],
    ]);

    mapToEnum(dto: TelecomOperatorDto | null | undefined): TelecomOperator {
        return TelecomOperatorMapper.MAP.get(dto ?? TelecomOperatorDto.UNKNOWN)
            ?? TelecomOperator.UNKNOWN;
    }

    mapStringToEnum(dtoValue: Array<TelecomOperatorDto>): Array<TelecomOperator> {
        if (dtoValue == null) {
            return [TelecomOperator.UNKNOWN];
        }
        if (!Array.isArray(dtoValue)) {
            dtoValue = JSON.parse(dtoValue);
        }
        const methodMap: Record<TelecomOperatorDto, TelecomOperator> = {
            [TelecomOperatorDto.MTN]: TelecomOperator.MTN,
            [TelecomOperatorDto.ORANGE]: TelecomOperator.ORANGE,
            [TelecomOperatorDto.MOOV]: TelecomOperator.MOOV,
            [TelecomOperatorDto.UNKNOWN]: TelecomOperator.UNKNOWN,
        };
        return dtoValue.map(
            (operator) => methodMap[operator] || TelecomOperator.UNKNOWN
        );
    }
}
