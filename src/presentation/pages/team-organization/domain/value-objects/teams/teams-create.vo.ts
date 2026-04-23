import { TeamsCreateDto } from '@pages/team-organization/application/dto/teams/teams-create.dto';

export class TeamsCreateVo {
    // readonly code: string;
    readonly name: string;
    readonly description: string;
    readonly operators: string[];
    readonly reportTypes: string[];
    readonly permissions: string[];

    private constructor(props: {
        // code: string;
        name: string;
        description: string;
        operators: string[];
        reportTypes: string[];
        permissions: string[];
    }) {
        // this.code = props.code;
        this.name = props.name;
        this.description = props.description;
        this.operators = props.operators;
        this.reportTypes = props.reportTypes;
        this.permissions = props.permissions;
    }

    static fromDto(dto: TeamsCreateDto): TeamsCreateVo {
        return new TeamsCreateVo({
            // code: dto.code,
            name: dto.name,
            description: dto.description,
            operators: dto.operators,
            reportTypes: dto.reportTypes,
            permissions: dto.permissions,
        });
    }
}
