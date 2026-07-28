import { RadioRelayLinksDisableCommand } from '@pages/coverage-areas/application/commands/radio-relay-links/radio-relay-links-disable.command';
import { RadioRelayLinksDisableContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-disable.contract';

export function radioRelayLinksDisableCommandMapper(
    command: RadioRelayLinksDisableCommand
): RadioRelayLinksDisableContract {
    return command;
}
