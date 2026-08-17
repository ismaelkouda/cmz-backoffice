import { SlideEntity } from '@pages/content-management/domain/entities/slide/slide.entity';
import { SlideVmProps } from '@pages/content-management/presentation/adapters/slide/slide-vm-props.interface';
import { Status } from '@presentation/pages/content-management/domain/enums/slide/slide-status.enum';
import { Platform } from '@shared/domain/enums/platform.enum';

export class SlidePresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(
        item: SlideEntity,
        permission: {
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
    ): SlideVmProps {
        return {
            uniqId: item.uniqId,
            type: item.type,
            subtitle: item.subtitle,
            title: item.title,

            platforms: item.platforms,
            platformsStyle: (platform: Platform) =>
                item.platformsStyle(platform),

            status: item.status,
            statusLabel: this.t(item.status),
            statusStyle: item.statusStyle(item.status),

            createdAt: item.createdAt,
            actionsRef: item.actionsRef,
            dropdownActions: [
                {
                    id: 'edit',
                    label: 'COMMON.EDIT',
                    icon: 'pi pi-pencil',
                    disabled: !permission.authorization.canEdit,
                    tooltip: permission.authorization.canEdit
                        ? this.t('CONTENT_MANAGEMENT.SLIDE.TOOLTIP.EDIT')
                        : permission.tooltip.edit,
                },
                ...(item.status === Status.INACTIVE
                    ? [
                          {
                              id: 'enable',
                              label: 'COMMON.ENABLE',
                              icon: 'pi pi-check',
                              disabled: !permission.authorization.canEnable,
                              tooltip: permission.authorization.canEnable
                                  ? this.t(
                                        'CONTENT_MANAGEMENT.SLIDE.TOOLTIP.ENABLE'
                                    )
                                  : permission.tooltip.enable,
                          },
                      ]
                    : [
                          {
                              id: 'disable',
                              label: 'COMMON.DISABLE',
                              icon: 'pi pi-times',
                              disabled: !permission.authorization.canDisable,
                              tooltip: permission.authorization.canDisable
                                  ? this.t(
                                        'CONTENT_MANAGEMENT.SLIDE.TOOLTIP.DISABLE'
                                    )
                                  : permission.tooltip.disable,
                          },
                      ]),

                {
                    id: 'delete',
                    label: 'COMMON.DELETE',
                    icon: 'pi pi-trash',
                    disabled:
                        item.status === Status.ACTIVE ||
                        !permission.authorization.canDelete,
                    tooltip:
                        permission.authorization.canDelete &&
                        item.status !== Status.ACTIVE
                            ? this.t('CONTENT_MANAGEMENT.SLIDE.TOOLTIP.DELETE')
                            : permission.tooltip.delete,
                },
            ],
            disableDropdown: !permission.authorization.canChoose,
            tooltipDropdown: permission.authorization.canChoose
                ? this.t('CONTENT_MANAGEMENT.SLIDE.TOOLTIP.CHOOSE')
                : permission.tooltip.choose,
        };
    }
}
