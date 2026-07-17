import { RegionsDeleteDto } from '@pages/administrative-boundary/application/dto/regions/regions-delete.dto';

export function regionsDeleteVo(dto: RegionsDeleteDto): RegionsDeleteDto {
    return {
        uniqId: dto.uniqId,
    };
}
