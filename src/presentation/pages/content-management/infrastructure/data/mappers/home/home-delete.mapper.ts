import { HomeDeleteEntity } from '@presentation/pages/content-management/domain/entities/home/home-delete.entity';
import { HomeDeleteApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/home/home-delete-api.dto';

export function homeDeleteMapper(vo: HomeDeleteEntity): HomeDeleteApiDto {
    const prams = {} as HomeDeleteApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
