import { SlideUnpublishDto } from '@presentation/pages/content-management/application/dto/slide/slide-unpublish.dto';

export class SlideUnpublishVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: SlideUnpublishDto): SlideUnpublishVo {
        return new SlideUnpublishVo({
            uniqId: dto.uniqId.trim(),
        });
    }
}
