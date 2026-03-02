import { HomeEnableDto } from '@presentation/pages/content-management/application/dto/home/home-enable.dto';

export class HomeEnableVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: HomeEnableDto): HomeEnableVo {
        return new HomeEnableVo({
            uniqId: dto.uniqId.trim(),
        });
    }
}
