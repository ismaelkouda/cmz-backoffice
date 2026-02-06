import { inject, Provider } from '@angular/core';

import { EnvService } from '@shared/services/env.service';

import { agentsPerformancesProviders } from '@presentation/pages/team-organization/di/agents-performances/agents-performances.providers';
import { participantsFindoneProviders } from '@presentation/pages/team-organization/di/participants/participants-findone.providers';
import { participantsSelectProviders } from '@presentation/pages/team-organization/di/participants/participants-select.providers';
import { participantsProviders } from '@presentation/pages/team-organization/di/participants/participants.providers';
import { rolesSelectProviders } from '@presentation/pages/team-organization/di/participants/roles-select.providers';
import { teamsFindOneProviders } from '@presentation/pages/team-organization/di/teams/teams-findone.providers';
// import { teamsFreeParticipantsProviders } from '@presentation/pages/team-organization/di/teams/teams-free-participants.providers';
import { teamsParticipantsProviders } from '@presentation/pages/team-organization/di/teams/teams-participants.providers';
import { teamsPermissionsProviders } from '@presentation/pages/team-organization/di/teams/teams-permissions.providers';
import { teamsSelectProviders } from '@presentation/pages/team-organization/di/teams/teams-select.providers';
import { teamsProviders } from '@presentation/pages/team-organization/di/teams/teams.providers';
import { TEAM_ORGANIZATION_BASE_URL } from '@presentation/pages/team-organization/infrastructure/api/team-organization.base-url';

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
    ...participantsFindoneProviders,
    ...rolesSelectProviders,
    ...participantsSelectProviders,

    ...teamsSelectProviders,
    ...teamsPermissionsProviders,
    ...teamsProviders,
    ...teamsParticipantsProviders,
    ...teamsFindOneProviders,
    // ...teamsFreeParticipantsProviders,
];
