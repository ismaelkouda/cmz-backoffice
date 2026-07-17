import { ParticipantsFindOneQuery } from '@pages/team-organization/application/queries/participants/participants-find-one.query';

export function participantsFindOneQueryMapper(
    command: ParticipantsFindOneQuery
) {
    return {
        uniqId: command.uniqId,
    };
}
