import { SlideCreateDto } from '@pages/content-management/application/dto/slide/slide-create.dto';
import { TitleRequiredError } from '@shared/domain/errors/validation/title-required.error';
import { TypeRequiredError } from '@shared/domain/errors/validation/type-required.error';
import { TimeDurationRequiredError } from '@shared/domain/errors/validation/time-duration-required.error';
import { TimeDurationInvalidError } from '@shared/domain/errors/validation/time-duration-invalid.error';
import { ImageRequiredError } from '@shared/domain/errors/validation/image-required.error';
import { VideoRequiredError } from '@shared/domain/errors/validation/video-required.error';
import { StartDateRequiredError } from '@shared/domain/errors/validation/date-required.error';
import { EndDateRequiredError } from '@shared/domain/errors/validation/end-date-required.error';
import { getEnumKeyByValue } from '@shared/components/filter/filter.types';
import { TypeMedia } from '@shared/domain/enums/type-media.enum';
import { PlatformsRequiredError } from '@shared/domain/errors/validation/platforms-required.error';
import { DateRangeInvalidError } from '@shared/domain/errors/validation/date-range-invalid.error';

export function validateSlideCreate(dto: SlideCreateDto): void {
    const VIDEO = getEnumKeyByValue(TypeMedia, TypeMedia.VIDEO) as string;
    const IMAGE = getEnumKeyByValue(TypeMedia, TypeMedia.IMAGE) as string;

    if (dto.timeDuration === null || Number.isNaN(dto.timeDuration)) {
        throw new TimeDurationRequiredError();
    }
    if (dto.timeDuration <= 0) {
        throw new TimeDurationInvalidError();
    }
    if (!dto.type) {
        throw new TypeRequiredError();
    }
    if (dto.type === IMAGE && !dto.image) {
        throw new ImageRequiredError();
    }
    if (dto.type === VIDEO && !dto.video) {
        throw new VideoRequiredError();
    }
    if (!dto.title?.trim()) {
        throw new TitleRequiredError();
    }
    if (!dto.platforms?.length) {
        throw new PlatformsRequiredError();
    }
    if (!dto.startDate) {
        throw new StartDateRequiredError();
    }
    if (!dto.endDate) {
        throw new EndDateRequiredError();
    }
    if (new Date(dto.startDate).getTime() > new Date(dto.endDate).getTime()) {
        throw new DateRangeInvalidError();
    }
}
