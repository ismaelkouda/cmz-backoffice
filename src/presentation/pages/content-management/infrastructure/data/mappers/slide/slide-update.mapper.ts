import { SlideUpdateEntity } from '@presentation/pages/content-management/domain/entities/slide/slide-update.entity';
import { SlideUpdateApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/slide/slide-update-api.dto';

export function slideUpdateMapper(
    entity: SlideUpdateEntity
): SlideUpdateApiDto {
    const params: SlideUpdateApiDto = {} as SlideUpdateApiDto;

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
