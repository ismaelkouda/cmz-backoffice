import { MunicipalitiesDeleteDto } from '@pages/administrative-boundary/application/dto/municipalities/municipalities-delete.dto';

export class MunicipalitiesDeleteVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: MunicipalitiesDeleteDto): MunicipalitiesDeleteVo {
        return new MunicipalitiesDeleteVo({
            uniqId: dto.uniqId,
        });
    }
}
