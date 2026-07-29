import { RadioRelayLinksVmProps } from './radio-relay-links-vm-props.interface';
import { ActionDropdownItem } from '@shared/components/action-dropdown/interfaces/action-dropdown.interface';
import { RadioRelayLinksEntity } from '@pages/coverage-areas/domain/entities/radio-relay-links/radio-relay-links.entity';
import { RadioRelayLinksStatus } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-status.enum';

export class RadioRelayLinksPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(
        entity: RadioRelayLinksEntity,
        options: {
            authorization: {
                canEdit: boolean;
                canDelete: boolean;
                canEnable: boolean;
                canDisable: boolean;
                canChoose: boolean;
            };
            tooltip: {
                edit: string;
                delete: string;
                enable: string;
                disable: string;
                choose: string;
            };
        }
    ): RadioRelayLinksVmProps {
        const { authorization, tooltip } = options;

        const actions: ActionDropdownItem[] = [
            {
                id: 'details',
                label: this.t('COMMON.DETAILS'),
                icon: 'pi pi-eye',
                tooltip: tooltip.choose,
            },
            {
                id: 'edit',
                label: this.t('COMMON.EDIT'),
                icon: 'pi pi-pencil',
                disabled: !authorization.canEdit,
                tooltip: authorization.canEdit
                    ? this.t('COVERAGE_AREAS.RADIO_RELAY_LINKS.TOOLTIP.EDIT')
                    : tooltip.edit,
            },
            {
                id: 'delete',
                label: this.t('COMMON.DELETE'),
                icon: 'pi pi-trash',
                disabled:
                    entity.status === RadioRelayLinksStatus.ACTIVE ||
                    !authorization.canDelete,
                tooltip:
                    authorization.canDelete &&
                    entity.status !== RadioRelayLinksStatus.ACTIVE
                        ? this.t(
                              'COVERAGE_AREAS.RADIO_RELAY_LINKS.TOOLTIP.DELETE'
                          )
                        : tooltip.delete,
                severity: 'danger',
            },
            ...(entity.status === RadioRelayLinksStatus.INACTIVE
                ? [
                      {
                          id: 'enable',
                          label: this.t('COMMON.ENABLE'),
                          icon: 'pi pi-check-circle',
                          disabled: !authorization.canEnable,
                          tooltip: authorization.canEnable
                              ? this.t(
                                    'COVERAGE_AREAS.RADIO_RELAY_LINKS.TOOLTIP.ENABLE'
                                )
                              : tooltip.enable,
                          severity: 'success' as const,
                      },
                  ]
                : [
                      {
                          id: 'disable',
                          label: this.t('COMMON.DISABLE'),
                          icon: 'pi pi-times-circle',
                          disabled: !authorization.canDisable,
                          tooltip: authorization.canDisable
                              ? this.t(
                                    'COVERAGE_AREAS.RADIO_RELAY_LINKS.TOOLTIP.DISABLE'
                                )
                              : tooltip.disable,
                          severity: 'danger' as const,
                      },
                  ]),
        ];

        return {
            uniqId: entity.uniqId,
            name: entity.name,
            operator: entity.operator,
            frequency: entity.frequency,
            startDate: entity.startDate,
            endDate: entity.endDate,
            status: entity.status,
            statusLabel: this.t(entity.status),
            statusStyle: entity.statusStyle(),
            updatedAt: entity.updatedAt,
            actionsRef: entity.actionsRef,
            dropdownActions: actions,
            disableDropdown: !authorization.canChoose,
            tooltipDropdown: authorization.canChoose
                ? this.t('COVERAGE_AREAS.RADIO_RELAY_LINKS.TOOLTIP.CHOOSE')
                : tooltip.choose,
        };
    }
}
