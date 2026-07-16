import { HomeDeleteDto } from '@pages/content-management/application/dto/home/home-delete.dto';
import { HomeDeleteApiDto } from '@pages/content-management/infrastructure/api/dto/home/home-delete-api.dto';

export function homeDeleteMapper(dto: HomeDeleteDto): HomeDeleteApiDto {
    const prams = {} as HomeDeleteApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}
