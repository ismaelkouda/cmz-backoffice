import { SlideCreateEntity } from '@presentation/pages/content-management/domain/entities/slide/slide-create.entity';
import { SlideCreateApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/slide/slide-create-api.dto';

export function slideCreateMapper(
    entity: SlideCreateEntity
): SlideCreateApiDto {
    const params: SlideCreateApiDto = {} as SlideCreateApiDto;

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
