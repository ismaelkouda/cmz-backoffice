import { FormControl } from '@angular/forms';
import { MessagingChannelsEnum } from '@pages/communication/domain/enums/messaging/messaging-channels.enum';
import { MessagingTargetEnum } from '@pages/communication/domain/enums/messaging/messaging-target.enum';

export interface MessagingFilterControl {
    search: FormControl<string>;
    // reportId: FormControl<string | null>;
    targetType?: FormControl<MessagingTargetEnum | undefined>;
    // region?: FormControl<string>;
    // department?: FormControl<string>;
    // municipality?: FormControl<string>;
    channels: FormControl<MessagingChannelsEnum[] | undefined>;
    // startDate?: FormControl<string>;
    // endDate?: FormControl<string>;
}
