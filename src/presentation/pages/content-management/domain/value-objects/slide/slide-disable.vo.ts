import { SlideDisableDto } from '@presentation/pages/content-management/application/dto/slide/slide-disable.dto';

export class SlideDisableVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: SlideDisableDto): SlideDisableVo {
        return new SlideDisableVo({
            uniqId: dto.uniqId,
        });
    }
}
