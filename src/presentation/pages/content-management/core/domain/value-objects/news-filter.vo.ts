import { MediaStatusDto } from "@shared/data/dtos/media-status.dto";
import { TypeMediaDto } from "@shared/data/dtos/type-media.dto";
import { NewsRequestDto } from "../../application/dtos/news/news-request.dto";

export class NewsFilter {
    private constructor(
        private readonly createdFrom?: string,
        private readonly createdTo?: string,
        private readonly type?: Array<TypeMediaDto>,
        private readonly status?: MediaStatusDto
    ) { }

    static create(data: NewsRequestDto = {} as NewsRequestDto): NewsFilter {
        return new NewsFilter(
            data.createdFrom,
            data.createdTo,
            data.type,
            data.status
        );
    }

    toDto(): any {
        const params: any = {};

        if (this.createdFrom)
            params['created_from'] = this.createdFrom;
        if (this.createdTo) params['created_to'] = this.createdTo;
        if (this.type) params['type'] = this.type;
        if (this.status) params['status'] = this.status;

        return params;
    }
}
