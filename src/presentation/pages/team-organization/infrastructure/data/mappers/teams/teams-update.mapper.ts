import { TeamsUpdateValidateContract } from '@pages/team-organization/domain/contracts/teams/teams-update.validate-contract';
import { TeamsUpdateApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-update-api.dto';

export function teamsUpdateMapper(
    props: TeamsUpdateValidateContract
): TeamsUpdateApiDto {
    const params: TeamsUpdateApiDto = {} as TeamsUpdateApiDto;

    params['id'] = props.uniqId;

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
