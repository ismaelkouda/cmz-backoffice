import { inject, Injectable } from '@angular/core';

import { HistoryFindOneEntity } from '../../domain/entities/history-find-one.entity';
import {
    HistoryChangeType,
    getChangeStyle,
    getChangeLabelKey,
} from '../../domain/enums/history-change-type.enum';
import { HistoryEventType } from '../../domain/enums/history-event-type.enum';
import { HistoryDataParserService } from '../../infrastructure/services/history-data-parser.service';
import { HistoryUserMapper } from '../../infrastructure/services/history-user.mapper';

import { HistoryDialogChangeRowVM } from './history-dialog-vm-props.interface';

@Injectable({ providedIn: 'root' })
export class HistoryDialogVmPresenter {
    private readonly dataParser = inject(HistoryDataParserService);
    private readonly userMapper = inject(HistoryUserMapper);

    map(entity: HistoryFindOneEntity | null, locale = 'fr') {
        if (!entity) {
            return this.emptyVm();
        }

        const changes = this.buildChanges(entity, locale);
        const changedFields = changes.filter((c) => c.changed).length;

        return {
            header: {
                titleKey: 'HISTORY.DIALOG.TITLE',
                uniqId: '',
                eventType: HistoryEventType.UNKNOWN,
                eventLabelKey: 'HISTORY.EVENT.UNKNOWN',
                eventSeverity: 'info',
                timestamp: '',
                canCopyId: false,
            },
            metadata: this.buildMetadata(entity, locale),
            summary: {
                totalFields: changes.length,
                changedFields,
                unchangedFields: changes.length - changedFields,
                hasDiff: changedFields > 0,
                summaryKey: 'HISTORY.SUMMARY.FIELDS_MODIFIED',
            },
            changes,
            ui: this.buildUi(entity, changedFields),
        };
    }

    private buildMetadata(entity: HistoryFindOneEntity, locale: string) {
        const user = entity.user;

        return {
            occurredAt: this.dataParser.normalizeValue(
                entity.createdAt,
                locale
            ),

            user: user
                ? {
                      fullName: this.userMapper.getUserFullName(user),
                      initials: this.userMapper.getUserInitials(user),
                  }
                : null,

            action: entity.action,
            operationKey: this.getOperationKey(entity.rawEvent),
            module: entity.module,
            accessMethod: entity.accessMethod,
            sourceIp: entity.sourceIp,
        };
    }

    private buildUi(entity: HistoryFindOneEntity, changedFields: number) {
        return {
            loading: false,
            empty: false,
            parseError: entity.changes.length === 0,
            showDiffTable: changedFields > 0,
        };
    }

    private emptyVm() {
        return {
            header: {
                titleKey: '',
                uniqId: '',
                eventType: HistoryEventType.UNKNOWN,
                eventLabelKey: '',
                eventSeverity: 'info',
                timestamp: '',
                canCopyId: false,
            },
            metadata: {
                occurredAt: '',
                user: null,
                action: '',
                module: '',
                accessMethod: undefined,
                sourceIp: undefined,
            },
            summary: {
                totalFields: 0,
                changedFields: 0,
                unchangedFields: 0,
                hasDiff: false,
                summaryKey: '',
            },
            changes: [],
            ui: {
                loading: true,
                empty: true,
                parseError: false,
                showDiffTable: false,
            },
        };
    }

    private buildChanges(
        entity: HistoryFindOneEntity,
        locale: string
    ): HistoryDialogChangeRowVM[] {
        if (!entity.changes || entity.changes.length === 0) {
            return [];
        }

        return entity.changes.map((change) => ({
            fieldKey: change.key,
            fieldLabel: this.formatFieldLabel(change.key),
            beforeDisplay: this.dataParser.normalizeValue(
                change.previousValue,
                locale
            ),
            afterDisplay: this.dataParser.normalizeValue(
                change.currentValue,
                locale
            ),
            changeLabelKey: getChangeLabelKey(change.changeType),
            changeStyle: getChangeStyle(change.changeType),
            changed: change.changeType !== HistoryChangeType.UNCHANGED,
            changeType: change.changeType,
            highlight: change.changeType === HistoryChangeType.UPDATED,
        }));
    }

    private getOperationKey(rawEvent: string): string {
        const normalized = rawEvent?.toLowerCase() || '';
        if (normalized.includes('création') || normalized === 'creation') {
            return 'HISTORY.OPERATION.CREATE';
        }
        if (
            normalized.includes('mise à jour') ||
            normalized === 'mise a jour'
        ) {
            return 'HISTORY.OPERATION.UPDATE';
        }
        if (normalized.includes('suppression')) {
            return 'HISTORY.OPERATION.DELETE';
        }
        return 'HISTORY.OPERATION.UNKNOWN';
    }

    private formatFieldLabel(field: string): string {
        return field.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
    }
}
