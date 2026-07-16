import { HomeDisableDto } from '@pages/content-management/application/dto/home/home-disable.dto';
import { HomeDisableApiDto } from '@pages/content-management/infrastructure/api/dto/home/home-disable-api.dto';

export function homeDisableMapper(dto: HomeDisableDto): HomeDisableApiDto {
    const prams = {} as HomeDisableApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}
