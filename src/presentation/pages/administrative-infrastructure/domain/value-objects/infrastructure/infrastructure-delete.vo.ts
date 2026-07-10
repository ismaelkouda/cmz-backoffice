import { InfrastructureDeleteDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure/infrastructure-delete.dto';

export class InfrastructureDeleteVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: InfrastructureDeleteDto): InfrastructureDeleteVo {
        return new InfrastructureDeleteVo({
            uniqId: dto.uniqId,
        });
    }
}
