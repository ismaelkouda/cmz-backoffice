import { HomeDisableDto } from '@pages/content-management/application/dto/home/home-disable.dto';

export class HomeDisableVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: HomeDisableDto): HomeDisableVo {
        return new HomeDisableVo({
            uniqId: dto.uniqId.trim(),
        });
    }
}
