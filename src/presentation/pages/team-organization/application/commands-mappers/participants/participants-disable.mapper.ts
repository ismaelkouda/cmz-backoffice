import { ParticipantsDisableCommand } from '@pages/team-organization/application/commands/participants/participants-disable.command';

export function participantsDisableCommandMapper(
    command: ParticipantsDisableCommand
) {
    return {
        uniqId: command.uniqId,
    };
}
