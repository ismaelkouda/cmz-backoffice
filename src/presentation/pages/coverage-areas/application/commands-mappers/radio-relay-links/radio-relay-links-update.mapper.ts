import { RadioRelayLinksUpdateCommand } from '@pages/coverage-areas/application/commands/radio-relay-links/radio-relay-links-update.command';
import { RadioRelayLinksUpdateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-update.contract';

export function radioRelayLinksUpdateCommandMapper(
    command: RadioRelayLinksUpdateCommand
): RadioRelayLinksUpdateContract {
    return command;
}
