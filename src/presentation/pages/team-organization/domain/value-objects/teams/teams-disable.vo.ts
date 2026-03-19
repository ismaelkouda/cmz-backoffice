import { TeamsDisableDto } from '@pages/team-organization/application/dto/teams/teams-disable.dto';

export class TeamsDisableVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: TeamsDisableDto): TeamsDisableVo {
        return new TeamsDisableVo({
            uniqId: dto.uniqId,
        });
    }
}
