import { ParticipantsEnableCommand } from '@pages/team-organization/application/commands/participants/participants-enable.command';

export function participantsEnableCommandMapper(
    command: ParticipantsEnableCommand
) {
    return {
        uniqId: command.uniqId,
    };
}
