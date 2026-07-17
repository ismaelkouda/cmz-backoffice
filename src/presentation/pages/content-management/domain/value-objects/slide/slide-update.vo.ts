import { SlideUpdateContract } from '@pages/content-management/domain/contracts/slide/slide-update.contract';
import { SlideUpdateProps } from '@pages/content-management/domain/interfaces/slide/slide-update-props.interface';
import { validateSlideUpdate } from '@pages/content-management/domain/validators/slide/slide-update.validator';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export function slideUpdateVo(contract: SlideUpdateContract): SlideUpdateProps {
    validateSlideUpdate(contract);
    const period = DatePeriod.create(contract.startDate, contract.endDate);
    return {
        uniqId: contract.uniqId,
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
