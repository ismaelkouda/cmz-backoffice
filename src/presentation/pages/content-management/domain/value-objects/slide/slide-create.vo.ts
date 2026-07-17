import { SlideCreateContract } from '@pages/content-management/domain/contracts/slide/slide-create.contract';
import { SlideCreateProps } from '@pages/content-management/domain/interfaces/slide/slide-create-props.interface';
import { validateSlideCreate } from '@pages/content-management/domain/validators/slide/slide-create.validator';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export function slideCreateVo(contract: SlideCreateContract): SlideCreateProps {
    validateSlideCreate(contract);
    const period = DatePeriod.create(contract.startDate, contract.endDate);
    return {
        timeDuration: contract.timeDuration,
        type: contract.type,
        image: contract.image,
        video: contract.video,
        platforms: contract.platforms,
        period,
        title: contract.title,
        subtitle: contract.subtitle ?? '',
        content: contract.content ?? '',
        buttonLabel: contract.buttonLabel,
        buttonUrl: contract.buttonUrl,
    };
}
