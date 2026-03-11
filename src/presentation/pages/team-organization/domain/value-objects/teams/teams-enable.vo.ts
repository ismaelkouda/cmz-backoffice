import { TeamsEnableDto } from '@pages/team-organization/application/dto/teams/teams-enable.dto';

export class TeamsEnableVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: TeamsEnableDto): TeamsEnableVo {
        return new TeamsEnableVo({
            uniqId: dto.uniqId.trim(),
        });
    }
}
