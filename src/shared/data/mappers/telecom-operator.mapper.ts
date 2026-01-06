import { Injectable } from '@angular/core';
import { TelecomOperatorDto } from '@shared/data/dtos/telecom-operator.dto';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';

@Injectable({
    providedIn: 'root',
})
export class TelecomOperatorMapper {
    mapToEnum(dtoValue: Array<TelecomOperatorDto>): Array<TelecomOperator> {
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

    mapToDto(enumValue: Array<TelecomOperator>): Array<TelecomOperatorDto> {
        if (enumValue == null) {
            return [TelecomOperatorDto.UNKNOWN];
        }
        if (!Array.isArray(enumValue)) {
            return [TelecomOperatorDto.UNKNOWN];
        }
        const mapping: Record<TelecomOperator, TelecomOperatorDto> = {
            [TelecomOperator.MTN]: TelecomOperatorDto.MTN,
            [TelecomOperator.ORANGE]: TelecomOperatorDto.ORANGE,
            [TelecomOperator.MOOV]: TelecomOperatorDto.MOOV,
            [TelecomOperator.UNKNOWN]: TelecomOperatorDto.UNKNOWN,
        };
        return enumValue.map(
            (operator) => mapping[operator] || TelecomOperatorDto.UNKNOWN
        );
    }
}
