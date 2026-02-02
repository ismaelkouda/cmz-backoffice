import { TeamsCreateDto } from '@presentation/pages/team-organization/application/dtos/teams/teams-create.dto';

export class TeamsCreateVo {
    readonly code: string;
    readonly name: string;
    readonly description: string;

    private constructor(props: { code: string; name: string; description: string }) {
        this.code = props.code;
        this.name = props.name;
        this.description = props.description;
    }

    static fromDto(dto: TeamsCreateDto): TeamsCreateVo {
        return new TeamsCreateVo({
            code: dto.code,
            name: dto.name,
            description: dto.description,
        });
    }
}
