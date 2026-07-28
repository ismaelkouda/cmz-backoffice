import { RadioRelayLinksEnableCommand } from '@pages/coverage-areas/application/commands/radio-relay-links/radio-relay-links-enable.command';
import { RadioRelayLinksEnableContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-enable.contract';

export function radioRelayLinksEnableCommandMapper(
    command: RadioRelayLinksEnableCommand
): RadioRelayLinksEnableContract {
    return command;
}
