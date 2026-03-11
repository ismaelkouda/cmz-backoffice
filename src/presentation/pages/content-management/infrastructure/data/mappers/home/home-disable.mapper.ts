import { HomeDisableEntity } from '@pages/content-management/domain/entities/home/home-disable.entity';
import { HomeDisableApiDto } from '@pages/content-management/infrastructure/api/dto/home/home-disable-api.dto';

export function homeDisableMapper(vo: HomeDisableEntity): HomeDisableApiDto {
    const prams = {} as HomeDisableApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
