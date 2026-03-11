import { NewsUpdateEntity } from '@pages/content-management/domain/entities/news/news-update.entity';
import { NewsUpdateApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-update-api.dto';

export function newsUpdateMapper(entity: NewsUpdateEntity): NewsUpdateApiDto {
    const params: NewsUpdateApiDto = {} as NewsUpdateApiDto;

    if (entity.uniqId) {
        params.id = entity.uniqId;
    }
    if (entity.firstName) {
        params.first_name = entity.firstName;
    }
    if (entity.lastName) {
        params.last_name = entity.lastName;
    }
    if (entity.email) {
        params.email = entity.email;
    }
    if (entity.phone) {
        params.phone_number = entity.phone;
    }
    if (entity.role) {
        params.role = entity.role;
    }

    return params;
}
