import { NewsCreateEntity } from '@pages/content-management/domain/entities/news/news-create.entity';
import { NewsCreateApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-create-api.dto';

export function newsCreateMapper(entity: NewsCreateEntity): NewsCreateApiDto {
    const params: NewsCreateApiDto = {} as NewsCreateApiDto;

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
