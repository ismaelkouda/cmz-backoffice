import { ManagementRequestDto } from '../../data/dtos/management/management-request.dto';
import { ManagementFormPayloadEntity } from '../entities/management/management-form-payload.entity';

export class ManagementForm {
    private constructor(
        private readonly uniqId: string,
        private readonly comment?: string,
        private readonly reason?: string
    ) {}

    static create(data: ManagementFormPayloadEntity): ManagementForm {
        return new ManagementForm(data.uniqId, data.comment, data.reason);
    }

    toDto(): ManagementRequestDto {
        return {
            uniq_id: this.uniqId,
            ...(this.comment && { comment: this.comment }),
            ...(this.reason && { reason: this.reason }),
        };
    }
}
