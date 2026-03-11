import { inject, Provider } from '@angular/core';
import { agentsPerformancesProviders } from '@pages/team-organization/di/agents-performances/agents-performances.providers';
import { participantsFindOneProviders } from '@pages/team-organization/di/participants/participants-find-one.providers';
import { participantsSelectProviders } from '@pages/team-organization/di/participants/participants-select.providers';
import { participantsProviders } from '@pages/team-organization/di/participants/participants.providers';
import { rolesSelectProviders } from '@pages/team-organization/di/participants/roles-select.providers';
import { teamsFindOneProviders } from '@pages/team-organization/di/teams/teams-find-one.providers';
// import { teamsFreeParticipantsProviders } from '@pages/team-organization/di/teams/teams-free-participants.providers';
import { teamsParticipantsProviders } from '@pages/team-organization/di/teams/teams-participants.providers';
import { teamsPermissionsProviders } from '@pages/team-organization/di/teams/teams-permissions.providers';
import { teamsSelectProviders } from '@pages/team-organization/di/teams/teams-select.providers';
import { teamsProviders } from '@pages/team-organization/di/teams/teams.providers';
import { TEAM_ORGANIZATION_BASE_URL } from '@pages/team-organization/infrastructure/api/team-organization.base-url';
import { EnvService } from '@shared/domain/services/env.service';

const getApiBaseUrl = () => {
    const baseUrl = inject(EnvService).authenticationUrl;

    if (!baseUrl) {
        console.warn(
            'TeamOrganization Module: API Base URL is missing in environment configuration.'
        );
    }

    return baseUrl;
};

export const provideTeamOrganization = (): Provider[] => [
    {
        provide: TEAM_ORGANIZATION_BASE_URL,
        useFactory: getApiBaseUrl,
    },
    ...agentsPerformancesProviders,

    ...participantsProviders,
    ...participantsFindOneProviders,
    ...rolesSelectProviders,
    ...participantsSelectProviders,

    ...teamsSelectProviders,
    ...teamsPermissionsProviders,
    ...teamsProviders,
    ...teamsParticipantsProviders,
    ...teamsFindOneProviders,
    // ...teamsFreeParticipantsProviders,
];
