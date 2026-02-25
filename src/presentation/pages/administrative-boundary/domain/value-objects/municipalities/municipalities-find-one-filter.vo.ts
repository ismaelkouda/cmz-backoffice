import { MunicipalitiesFindOneFilterDto } from '@presentation/pages/administrative-boundary/application/dto/municipalities/municipalities-find-one-filter.dto';

export class MunicipalitiesFindOneFilterVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(
        dto: MunicipalitiesFindOneFilterDto
    ): MunicipalitiesFindOneFilterVo {
        return new MunicipalitiesFindOneFilterVo({
            uniqId: dto.uniqId,
        });
    }
}
