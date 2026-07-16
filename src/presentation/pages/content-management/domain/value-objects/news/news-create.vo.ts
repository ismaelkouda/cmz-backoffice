import { NewsCreateContract } from '@pages/content-management/domain/contracts/news/news-create.contract';
import { NewsCreateProps } from '@pages/content-management/domain/interfaces/news/news-create-props.interface';
import { validateNewsCreate } from '@pages/content-management/domain/validators/news/news-create.validator';

export function newsCreateVo(contract: NewsCreateContract): NewsCreateProps {
    validateNewsCreate(contract);
    return {
        type: contract.type,
        image: contract.image,
        video: contract.video,
        category: contract.category,
        subCategory: contract.subCategory ?? '',
        hashtags: contract.hashtags ?? [],
        title: contract.title,
        resume: contract.resume,
        content: contract.content,
    };
}
