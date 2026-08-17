import { ActorEntity } from '@shared/domain/entities/actor.entity';

import { HistoryEventType } from '../enums/history-event-type.enum';
import {
    HistoryFieldChange,
    HistoryFindOneProps,
} from '../interfaces/history-find-one-props.interface';

export class HistoryFindOneEntity {
    constructor(private readonly props: HistoryFindOneProps) {
        this.props = { ...props };
    }

    get uniqId(): string {
        return this.props.uniqId;
    }

    get createdAt(): string {
        return this.props.createdAt;
    }

    get event(): HistoryEventType {
        return this.props.event;
    }

    get rawEvent(): string {
        return this.props.rawEvent;
    }

    get action(): string {
        return this.props.action;
    }

    get module(): string {
        return this.props.module;
    }

    get accessMethod(): string | undefined {
        return this.props.accessMethod;
    }

    get sourceIp(): string | undefined {
        return this.props.sourceIp;
    }

    get user(): ActorEntity | null {
        return this.props.user;
    }

    get changes(): HistoryFieldChange[] {
        return this.props.changes;
    }

    get hasChanges(): boolean {
        return this.props.changes.length > 0;
    }

    get timestamps() {
        return this.props.timestamps;
    }

    isCreateEvent(): boolean {
        return this.props.event === HistoryEventType.CREATE;
    }

    isUpdateEvent(): boolean {
        return this.props.event === HistoryEventType.UPDATE;
    }

    isDeleteEvent(): boolean {
        return this.props.event === HistoryEventType.DELETE;
    }

    with(props: Partial<HistoryFindOneProps>): HistoryFindOneEntity {
        return new HistoryFindOneEntity({ ...this.props, ...props });
    }
}
