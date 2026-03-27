import { SlideEnableDto } from '@pages/content-management/application/dto/slide/slide-enable.dto';

export class SlideEnableVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: SlideEnableDto): SlideEnableVo {
        return new SlideEnableVo({
            uniqId: dto.uniqId,
        });
    }
}
