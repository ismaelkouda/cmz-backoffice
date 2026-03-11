import { SlideDeleteDto } from '@pages/content-management/application/dto/slide/slide-delete.dto';

export class SlideDeleteVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: SlideDeleteDto): SlideDeleteVo {
        return new SlideDeleteVo({
            uniqId: dto.uniqId.trim(),
        });
    }
}
