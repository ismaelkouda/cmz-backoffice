import { TeamsFilterDto } from '@pages/team-organization/application/dto/teams/teams-filter.dto';
import { TeamsFilterControl } from '@pages/team-organization/domain/controls/teams/teams-filter.control';

export function toFilterDto(control: TeamsFilterControl): TeamsFilterDto {
    return {
        search: control.search.value,
        member: control.member.value,
        status: control.status.value,
    };
}
