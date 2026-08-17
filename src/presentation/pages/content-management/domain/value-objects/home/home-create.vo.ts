import { HomeCreateContract } from '@pages/content-management/domain/contracts/home/home-create.contract';
import { HomeCreateProps } from '@pages/content-management/domain/interfaces/home/home-create-props.interface';
import { validateHomeCreate } from '@pages/content-management/domain/validators/home/home-create.validator';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export function homeCreateVo(contract: HomeCreateContract): HomeCreateProps {
    validateHomeCreate(contract);
    const period = DatePeriod.create(contract.startDate, contract.endDate);
    return {
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
