import { TeamsDeleteDto } from '@presentation/pages/team-organization/application/dto/teams/teams-delete.dto';

export class TeamsDeleteVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: TeamsDeleteDto): TeamsDeleteVo {
        return new TeamsDeleteVo({
            uniqId: dto.uniqId.trim(),
        });
    }
}
