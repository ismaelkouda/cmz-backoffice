import { ParticipantsQuery } from '@pages/team-organization/application/queries/participants/participants.query';

export function participantsQueryMapper(command: ParticipantsQuery) {
    return {
        search: command?.search,
        role: command?.role,
        team: command?.team,
        status: command?.status,
    };
}
