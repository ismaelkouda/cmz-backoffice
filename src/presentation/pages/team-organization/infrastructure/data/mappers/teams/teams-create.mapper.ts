import { TeamsCreateValidateContract } from '@pages/team-organization/domain/contracts/teams/teams-create.validate-contract';
import { TeamsCreateApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-create-api.dto';

export function TeamsCreateMapper(
    props: TeamsCreateValidateContract
): TeamsCreateApiDto {
    const params: TeamsCreateApiDto = {} as TeamsCreateApiDto;

    // if (props.code) {
    //     params['code'] = props.code;
    // }

    if (props.name) {
        params['name'] = props.name;
    }
    if (props.description) {
        params['description'] = props.description;
    }
    if (props.operators) {
        params['operators'] = props.operators;
    }
    if (props.reportTypes) {
        params['report_types'] = props.reportTypes;
    }
    if (props.permissions) {
        params['permissions'] = props.permissions.map(Number);
    }

    return params;
}
