import { ParticipantsDeleteCommand } from '@pages/team-organization/application/commands/participants/participants-delete.command';

export function participantsDeleteCommandMapper(
    command: ParticipantsDeleteCommand
) {
    return {
        uniqId: command.uniqId,
    };
}
