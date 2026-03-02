import { HomeDeleteDto } from '@presentation/pages/content-management/application/dto/home/home-delete.dto';

export class HomeDeleteVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: HomeDeleteDto): HomeDeleteVo {
        return new HomeDeleteVo({
            uniqId: dto.uniqId.trim(),
        });
    }
}
