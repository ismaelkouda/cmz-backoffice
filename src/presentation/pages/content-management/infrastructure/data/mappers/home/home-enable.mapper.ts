import { HomeEnableDto } from '@pages/content-management/application/dto/home/home-enable.dto';
import { HomeEnableApiDto } from '@pages/content-management/infrastructure/api/dto/home/home-enable-api.dto';

export function homeEnableMapper(dto: HomeEnableDto): HomeEnableApiDto {
    const prams = {} as HomeEnableApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}
