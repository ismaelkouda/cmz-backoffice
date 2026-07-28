import { RadioRelayLinksCreateCommand } from '@pages/coverage-areas/application/commands/radio-relay-links/radio-relay-links-create.command';
import { RadioRelayLinksCreateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-create.contract';

export function radioRelayLinksCreateCommandMapper(
    command: RadioRelayLinksCreateCommand
): RadioRelayLinksCreateContract {
    return command;
}
