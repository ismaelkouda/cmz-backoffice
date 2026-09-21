import { FormControl } from '@angular/forms';
import { MessagingChannelsEnum } from '@pages/communication/domain/enums/messaging/messaging-channels.enum';
import { MessagingTargetEnum } from '@pages/communication/domain/enums/messaging/messaging-target.enum';
import { MessagingTypeEnum } from '@pages/communication/domain/enums/messaging/messaging-type.enum';

export interface MessagingFormControl {
    reportId: FormControl<string>;
    type: FormControl<MessagingTypeEnum | undefined>;
    targetType: FormControl<MessagingTargetEnum | undefined>;
    region: FormControl<number | undefined>;
    department: FormControl<number | undefined>;
    municipality: FormControl<number | undefined>;
    channels: FormControl<MessagingChannelsEnum[] | undefined>;
    subject: FormControl<string>;
    content: FormControl<string>;
}
