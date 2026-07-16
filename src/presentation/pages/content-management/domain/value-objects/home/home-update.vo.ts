import { HomeUpdateContract } from '@pages/content-management/domain/contracts/home/home-update.contract';
import { HomeUpdateProps } from '@pages/content-management/domain/interfaces/home/home-update-props.interface';
import { validateHomeUpdate } from '@pages/content-management/domain/validators/home/home-update.validator';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export function homeUpdateVo(contract: HomeUpdateContract): HomeUpdateProps {
    validateHomeUpdate(contract);
    const period = DatePeriod.create(contract.startDate, contract.endDate);
    return {
        uniqId: contract.uniqId,
        title: contract.title,
        resume: contract.resume,
        content: contract.content,
        image: contract.image,
        platforms: contract.platforms,
        period,
        buttonLabel: contract.buttonLabel,
        buttonUrl: contract.buttonUrl,
    };
}
