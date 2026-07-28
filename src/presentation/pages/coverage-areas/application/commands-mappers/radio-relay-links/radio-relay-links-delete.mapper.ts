import { RadioRelayLinksDeleteCommand } from '@pages/coverage-areas/application/commands/radio-relay-links/radio-relay-links-delete.command';
import { RadioRelayLinksDeleteContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-delete.contract';

export function radioRelayLinksDeleteCommandMapper(
    command: RadioRelayLinksDeleteCommand
): RadioRelayLinksDeleteContract {
    return command;
}
