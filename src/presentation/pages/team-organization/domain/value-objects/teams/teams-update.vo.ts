import { TeamsUpdateDto } from '@pages/team-organization/application/dto/teams/teams-update.dto';

export class TeamsUpdateVo {
    readonly uniqId: string;
    // readonly code: string;
    readonly name: string;
    readonly description: string;
    readonly operators: string[];
    readonly reportTypes: string[];
    readonly permissions: any[];

    private constructor(props: {
        uniqId: string;
        // code: string;
        name: string;
        description: string;
        operators: string[];
        reportTypes: string[];
        permissions: any[];
    }) {
        this.uniqId = props.uniqId;
        // this.code = props.code;
        this.name = props.name;
        this.description = props.description;
        this.operators = props.operators;
        this.reportTypes = props.reportTypes;
        this.permissions = props.permissions;
    }

    static fromDto(dto: TeamsUpdateDto): TeamsUpdateVo {
        return new TeamsUpdateVo({
            uniqId: dto.uniqId,
            // code: dto.code,
            name: dto.name,
            description: dto.description,
            operators: dto.operators,
            reportTypes: dto.reportTypes,
            permissions: dto.permissions,
        });
    }
}
