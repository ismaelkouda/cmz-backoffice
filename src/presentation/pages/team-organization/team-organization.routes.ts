import { Routes } from '@angular/router';
import { FormAgentIaComponent } from './feature/agent-ia/form-agent-ia/form-agent-ia.component';
import { FormParticipantComponent } from './feature/participants/form-participant/form-participant.component';
import { FormTeamComponent } from './feature/teams/form-team/form-team.component';
import { ManagementTeamAssignComponent } from './feature/teams/management-team-assign/management-team-assign.component';
import { AgentIaComponent } from './ui/agent-ia/agent-ia.component';
import { ParticipantsComponent } from './ui/participants/participants.component';
import { TeamsComponent } from './ui/teams/teams.component';

export const PARTICIPANT_ROUTE = 'participant';
export const TEAM_ROUTE = 'team';
export const AGENT_IA_ROUTE = 'agent-ia';
export const FORM_ROUTE = 'form';
export const MANAGEMENT_AFFECTED_ROUTE = 'management-affected';

export const routes: Routes = [
    {
        path: PARTICIPANT_ROUTE,
        children: [
            {
                path: '',
                component: ParticipantsComponent,
                data: {
                    title: 'TEAM_ORGANIZATION.PARTICIPANT.TITLE',
                    module: 'TEAM_ORGANIZATION.LABEL',
                    subModule: 'TEAM_ORGANIZATION.PARTICIPANT.LABEL',
                },
            },
            {
                path: FORM_ROUTE,
                component: FormParticipantComponent,
                data: {
                    title: 'TEAM_ORGANIZATION.PARTICIPANT.FORM.CREATE_TITLE',
                    module: 'TEAM_ORGANIZATION.LABEL',
                    subModule: 'TEAM_ORGANIZATION.PARTICIPANT.LABEL',
                },
            },
            {
                path: `${FORM_ROUTE}/:id`,
                component: FormParticipantComponent,
                data: {
                    title: 'TEAM_ORGANIZATION.PARTICIPANT.FORM.EDIT_TITLE',
                    module: 'TEAM_ORGANIZATION.LABEL',
                    subModule: 'TEAM_ORGANIZATION.PARTICIPANT.LABEL',
                },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
    {
        path: TEAM_ROUTE,
        children: [
            {
                path: '',
                component: TeamsComponent,
                data: {
                    title: 'TEAM_ORGANIZATION.TEAM.TITLE',
                    module: 'TEAM_ORGANIZATION.LABEL',
                    subModule: 'TEAM_ORGANIZATION.TEAM.LABEL',
                },
            },
            {
                path: FORM_ROUTE,
                component: FormTeamComponent,
                data: {
                    title: 'TEAM_ORGANIZATION.TEAM.FORM.CREATE_TITLE',
                    module: 'TEAM_ORGANIZATION.LABEL',
                    subModule: 'TEAM_ORGANIZATION.TEAM.LABEL',
                },
            },
            {
                path: `${FORM_ROUTE}/:id`,
                component: FormTeamComponent,
                data: {
                    title: 'TEAM_ORGANIZATION.TEAM.FORM.EDIT_TITLE',
                    module: 'TEAM_ORGANIZATION.LABEL',
                    subModule: 'TEAM_ORGANIZATION.TEAM.LABEL',
                },
            },
            {
                path: `:id/${MANAGEMENT_AFFECTED_ROUTE}`,
                component: ManagementTeamAssignComponent,
                data: {
                    title: 'TEAM_ORGANIZATION.TEAM.MANAGEMENT_AFFECTED.TITLE',
                    module: 'TEAM_ORGANIZATION.LABEL',
                    subModule: 'TEAM_ORGANIZATION.TEAM.LABEL',
                },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
    {
        path: AGENT_IA_ROUTE,
        children: [
            {
                path: '',
                component: AgentIaComponent,
                data: {
                    title: 'TEAM_ORGANIZATION.AGENT_IA.TITLE',
                    module: 'TEAM_ORGANIZATION.LABEL',
                    subModule: 'TEAM_ORGANIZATION.AGENT_IA.LABEL',
                },
            },
            {
                path: FORM_ROUTE,
                component: FormAgentIaComponent,
                data: {
                    title: 'TEAM_ORGANIZATION.AGENT_IA.FORM.CREATE_TITLE',
                    module: 'TEAM_ORGANIZATION.LABEL',
                    subModule: 'TEAM_ORGANIZATION.AGENT_IA.LABEL',
                },
            },
            {
                path: `${FORM_ROUTE}/:id`,
                component: FormAgentIaComponent,
                data: {
                    title: 'TEAM_ORGANIZATION.AGENT_IA.FORM.EDIT_TITLE',
                    module: 'TEAM_ORGANIZATION.LABEL',
                    subModule: 'TEAM_ORGANIZATION.AGENT_IA.LABEL',
                },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
    {
        path: '',
        redirectTo: PARTICIPANT_ROUTE,
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: PARTICIPANT_ROUTE,
    },
];
