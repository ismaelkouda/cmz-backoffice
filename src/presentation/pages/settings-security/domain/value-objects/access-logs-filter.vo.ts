/* import { AccessLogsFilterPayloadEntity } from '../entities/access-logs/access-logs-filter-payload.entity';

export class AccessLogsFilter {
    private constructor(
        public readonly createdFrom?: string,
        public readonly createdTo?: string,
        public readonly authUserId?: string,
    ) {
    }

    static create(payload: AccessLogsFilterPayloadEntity): AccessLogsFilter {
        return new AccessLogsFilter(
            payload.created_from,
            payload.created_to,
            payload.auth_user_id,
        );
    }

    toDto(): AccessLogsFilterPayloadEntity {
        return {
            created_from: this.createdFrom,
            created_to: this.createdTo,
            auth_user_id: this.authUserId,
        };
    }
}
 */