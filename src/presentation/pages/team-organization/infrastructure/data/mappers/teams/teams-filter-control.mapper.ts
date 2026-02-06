import { TeamsFilterDto } from '@presentation/pages/team-organization/application/dtos/teams/teams-filter.dto';
import { TeamsFilterControl } from '@presentation/pages/team-organization/domain/controls/teams/teams-filter.control';

export function toFilterDto(control: TeamsFilterControl): TeamsFilterDto {
    return {
        search: control.search.value,
        member: control.member.value,
        isActive: control.isActive.value,
    };
}
