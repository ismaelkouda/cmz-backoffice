import { MessagingCreateContract } from '@presentation/pages/communication/domain/contracts/messaging/messaging-create.contract';
import { TypeRequiredError } from '@shared/domain/errors/validation/type-required.error';
import { ReportIdRequiredError } from '@presentation/pages/communication/domain/errors/messaging/messaging-report-id.error';
import { RegionRequiredError } from '@presentation/pages/communication/domain/errors/messaging/messaging-region.error';
import { TargetTypeRequiredError } from '@presentation/pages/communication/domain/errors/messaging/messaging-target-type.error';
import { ChannelsRequiredError } from '@presentation/pages/communication/domain/errors/messaging/messaging-channels.error';
import { SubjectRequiredError } from '@presentation/pages/communication/domain/errors/messaging/messaging-subject.error';
import { ContentRequiredError } from '@presentation/pages/communication/domain/errors/messaging/messaging-content.error';
import { MessagingTargetEnum } from '@presentation/pages/communication/domain/enums/messaging/messaging-target.enum';
import { MessagingCreateValidateContract } from '@presentation/pages/communication/domain/contracts/messaging/messaging-create.validate-contract';

export function validateMessagingCreate(
    contract: MessagingCreateContract
): asserts contract is MessagingCreateValidateContract {
    if (!contract.type) {
        throw new TypeRequiredError();
    }
    if (!contract.targetType) {
        throw new TargetTypeRequiredError();
    }
    if (
        contract.targetType === MessagingTargetEnum.REPORT &&
        !contract.reportId
    ) {
        throw new ReportIdRequiredError();
    }
    if (contract.targetType === MessagingTargetEnum.AREA && !contract.region) {
        throw new RegionRequiredError();
    }
    if (!contract.channels || contract.channels.length < 1) {
        throw new ChannelsRequiredError();
    }
    if (!contract.subject) {
        throw new SubjectRequiredError();
    }
    if (!contract.content) {
        throw new ContentRequiredError();
    }
}
