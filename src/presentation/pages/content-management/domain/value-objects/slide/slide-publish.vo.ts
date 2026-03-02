import { SlidePublishDto } from '@presentation/pages/content-management/application/dto/slide/slide-publish.dto';

export class SlidePublishVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: SlidePublishDto): SlidePublishVo {
        return new SlidePublishVo({
            uniqId: dto.uniqId.trim(),
        });
    }
}
