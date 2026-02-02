import { TeamsUpdateDto } from '@presentation/pages/team-organization/application/dtos/teams/teams-update.dto';

export class TeamsUpdateVo {
    readonly uniqId: string;
    readonly code: string;
    readonly name: string;
    readonly description: string;

    private constructor(props: {
        uniqId: string;
        code: string;
        name: string;
        description: string;
    }) {
        this.uniqId = props.uniqId;
        this.code = props.code;
        this.name = props.name;
        this.description = props.description;
    }

    static fromDto(dto: TeamsUpdateDto): TeamsUpdateVo {
        return new TeamsUpdateVo({
            uniqId: dto.uniqId,
            code: dto.code,
            name: dto.name,
            description: dto.description,
        });
    }
}
