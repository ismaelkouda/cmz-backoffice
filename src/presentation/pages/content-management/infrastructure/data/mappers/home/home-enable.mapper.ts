import { HomeEnableEntity } from '@presentation/pages/content-management/domain/entities/home/home-enable.entity';
import { HomeEnableApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/home/home-enable-api.dto';

export function homeEnableMapper(vo: HomeEnableEntity): HomeEnableApiDto {
    const prams = {} as HomeEnableApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
