// history-dialog-vm.presenter.ts (CORRIGÉ)
import { inject, Injectable } from '@angular/core';
import { TableConfig } from '@shared/domain/interfaces/table-config';

import { HistoryFindOneEntity } from '../../domain/entities/history-find-one.entity';
import {
    HistoryChangeType,
    getChangeStyle,
    getChangeLabelKey,
} from '../../domain/enums/history-change-type.enum';
import {
    getEventLabelKey,
    getEventSeverity,
    HistoryEventType,
} from '../../domain/enums/history-event-type.enum';
import { HistoryDataParserService } from '../../infrastructure/services/history-data-parser.service';
import { HistoryUserMapper } from '../../infrastructure/services/history-user.mapper';

import {
    HistoryDialogChangeRowVM,
    HistoryDialogViewModel,
} from './history-dialog-vm-props.interface';
import {
    HISTORY_DIFF_TABLE_CONFIG,
    HISTORY_SNAPSHOT_TABLE_CONFIG,
} from './history-dialog.constant';
import { HistoryTableMode } from './history-table-mode.enum';

@Injectable({ providedIn: 'root' })
export class HistoryDialogVmPresenter {
    private readonly dataParser = inject(HistoryDataParserService);
    private readonly userMapper = inject(HistoryUserMapper);

    map(
        entity: HistoryFindOneEntity | null,
        locale = 'fr'
    ): HistoryDialogViewModel {
        if (!entity) {
            return this.getEmptyViewModel();
        }

        const changes = this.buildChanges(entity, locale);
        const changedFields = changes.filter((c) => c.changed).length;

        // 🔴 LOGIQUE MÉTIER: Sélection de la configuration selon le type d'évènement
        const tableMode = this.getTableMode(entity);
        const tableConfig = this.getTableConfig(tableMode);
        const tableRows = this.getTableRows(changes, tableMode);

        return {
            header: {
                titleKey: 'HISTORY.DIALOG.TITLE',
                uniqId: entity.uniqId,
                eventType: entity.event,
                eventLabelKey: getEventLabelKey(entity.event),
                eventSeverity: getEventSeverity(entity.event),
                timestamp: this.formatDate(entity.createdAt, locale),
                canCopyId: true,
            },
            metadata: this.buildMetadata(entity, locale),
            summary: {
                totalFields: changes.length,
                changedFields: changedFields,
                unchangedFields: changes.length - changedFields,
                hasDiff: changedFields > 0,
                summaryKey: 'HISTORY.SUMMARY.FIELDS_MODIFIED',
            },
            table: {
                mode: tableMode,
                config: tableConfig,
                rows: tableRows,
            },
            ui: {
                loading: false,
                empty: changes.length === 0,
                parseError: false,
                showDiffTable: changes.length > 0,
            },
        };
    }

    /**
     * 🔴 DÉCISION MÉTIER: Détermine le mode de table en fonction du type d'évènement
     * @param entity
     */
    private getTableMode(entity: HistoryFindOneEntity): HistoryTableMode {
        if (entity.isUpdateEvent()) {
            return HistoryTableMode.DIFF;
        }
        // CREATE ou DELETE → mode SNAPSHOT
        return HistoryTableMode.SNAPSHOT;
    }

    /**
     * 🔴 Retourne la configuration correspondant au mode
     * @param mode
     */
    private getTableConfig(mode: HistoryTableMode): TableConfig {
        switch (mode) {
            case HistoryTableMode.DIFF:
                return HISTORY_DIFF_TABLE_CONFIG;
            case HistoryTableMode.SNAPSHOT:
                return HISTORY_SNAPSHOT_TABLE_CONFIG;
            default:
                return HISTORY_SNAPSHOT_TABLE_CONFIG;
        }
    }

    /**
     * 🔴 Prépare les lignes de la table selon le mode
     * Pour SNAPSHOT, on ne garde que fieldLabel et afterDisplay
     * @param changes
     * @param mode
     */
    private getTableRows(
        changes: HistoryDialogChangeRowVM[],
        mode: HistoryTableMode
    ): HistoryDialogChangeRowVM[] {
        if (mode === HistoryTableMode.DIFF) {
            return changes;
        }

        // Mode SNAPSHOT: on conserve seulement fieldLabel et afterDisplay
        // Les propriétés beforeDisplay, changeLabelKey, etc. ne sont pas affichées
        return changes.map((change) => ({
            ...change,
            // Pour SNAPSHOT, afterDisplay contient la valeur (créée ou supprimée)
            beforeDisplay: '', // Vide car non utilisé
            changeLabelKey: '', // Vide car non utilisé
            changed: false,
            highlight: false,
        }));
    }

    private buildMetadata(entity: HistoryFindOneEntity, locale: string) {
        const user = entity.user;
        return {
            occurredAt: this.formatDate(entity.createdAt, locale),
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

    private formatFieldLabel(field: string): string {
        const fieldMap: Record<string, string> = {
            nom: 'Nom',
            prenoms: 'Prénoms',
            email: 'Email',
            telephone: 'Téléphone',
            adresse: 'Adresse',
            status: 'Statut',
            role: 'Rôle',
            description: 'Description',
            created_at: 'Date de création',
            updated_at: 'Date de modification',
            permissions: 'Permissions',
            slug: 'Slug',
            statut: 'Statut',
        };
        return (
            fieldMap[field] ||
            field.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
        );
    }

    private formatDate(dateStr: string, locale: string): string {
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) {
                return dateStr;
            }
            return new Intl.DateTimeFormat(locale, {
                dateStyle: 'full',
                timeStyle: 'medium',
            }).format(date);
        } catch {
            return dateStr;
        }
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

    private getEmptyViewModel(): HistoryDialogViewModel {
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
                operationKey: '',
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
            table: {
                mode: HistoryTableMode.SNAPSHOT,
                config: HISTORY_SNAPSHOT_TABLE_CONFIG,
                rows: [],
            },
            ui: {
                loading: true,
                empty: true,
                parseError: false,
                showDiffTable: false,
            },
        };
    }
}
