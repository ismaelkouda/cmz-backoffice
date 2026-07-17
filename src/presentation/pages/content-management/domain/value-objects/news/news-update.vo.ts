import { NewsUpdateContract } from '@pages/content-management/domain/contracts/news/news-update.contract';
import { NewsUpdateProps } from '@pages/content-management/domain/interfaces/news/news-update-props.interface';
import { validateNewsUpdate } from '@pages/content-management/domain/validators/news/news-update.validator';

export function newsUpdateVo(contract: NewsUpdateContract): NewsUpdateProps {
    validateNewsUpdate(contract);
    return {
        uniqId: contract.uniqId,
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
