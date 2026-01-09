/* import { AccessLogsFilterPayloadEntity } from '../entities/access-logs/access-logs-filter-payload.entity';

export class AccessLogsFilter {
    private constructor(
        public readonly startDate?: string,
        public readonly endDate?: string,
        public readonly authUserId?: string,
    ) {
    }

    static create(payload: AccessLogsFilterPayloadEntity): AccessLogsFilter {
        return new AccessLogsFilter(
            payload.start_date,
            payload.end_date,
            payload.auth_user_id,
        );
    }

    toDto(): AccessLogsFilterPayloadEntity {
        return {
            start_date: this.startDate,
            end_date: this.endDate,
            auth_user_id: this.authUserId,
        };
    }
}
 */
