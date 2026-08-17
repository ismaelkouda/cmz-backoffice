import { MessagingUpdateContract } from '@presentation/pages/communication/domain/contracts/messaging/messaging-update.contract';
import { UniqIdRequiredError } from '@presentation/pages/communication/domain/errors/messaging/messaging-uniq-id.error';
import { TypeRequiredError } from '@presentation/pages/communication/domain/errors/messaging/messaging-type.error';
import { ReportIdRequiredError } from '@presentation/pages/communication/domain/errors/messaging/messaging-report-id.error';
import { RegionRequiredError } from '@presentation/pages/communication/domain/errors/messaging/messaging-region.error';
import { TargetTypeRequiredError } from '@presentation/pages/communication/domain/errors/messaging/messaging-target-type.error';
import { ChannelsRequiredError } from '@presentation/pages/communication/domain/errors/messaging/messaging-channels.error';
import { SubjectRequiredError } from '@presentation/pages/communication/domain/errors/messaging/messaging-subject.error';
import { ContentRequiredError } from '@presentation/pages/communication/domain/errors/messaging/messaging-content.error';
import { MessagingTargetEnum } from '@presentation/pages/communication/domain/enums/messaging/messaging-target.enum';
import { MessagingUpdateValidateContract } from '@presentation/pages/communication/domain/contracts/messaging/messaging-update.validate-contract';

export function validateMessagingUpdate(
    contract: MessagingUpdateContract
): asserts contract is MessagingUpdateValidateContract {
    if (!contract.uniqId) {
        throw new UniqIdRequiredError();
    }
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
