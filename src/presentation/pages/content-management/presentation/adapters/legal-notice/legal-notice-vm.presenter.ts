import { LegalNoticeEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice.entity';
import { LegalNoticeVmProps } from '@pages/content-management/presentation/adapters/legal-notice/legal-notice-vm-props.interface';
import { Status } from '@presentation/pages/content-management/domain/enums/legal-notice/legal-notice-status.enum';

export class LegalNoticePresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(
        item: LegalNoticeEntity,
        permission: {
            authorization: {
                canEdit: boolean;
                canDelete: boolean;
                canPublish: boolean;
                canUnpublish: boolean;
                canChoose: boolean;
            };
            tooltip: {
                edit: string;
                delete: string;
                publish: string;
                unpublish: string;
                choose: string;
            };
        }
    ): LegalNoticeVmProps {
        return {
            uniqId: item.uniqId,
            version: item.version,
            status: item.status,
            statusLabel: this.t(item.status),
            statusStyle: item.statusStyle(item.status),
            createdAt: item.createdAt,
            publishedAt: item.publishedAt,
            actionsRef: item.actionsRef,
            dropdownActions: [
                {
                    id: 'edit',
                    label: 'COMMON.EDIT',
                    icon: 'pi pi-pencil',
                    disabled: !permission.authorization.canEdit,
                    tooltip: permission.authorization.canEdit
                        ? this.t('CONTENT_MANAGEMENT.LEGAL_NOTICE.TOOLTIP.EDIT')
                        : permission.tooltip.edit,
                },
                ...(item.status === Status.UNPUBLISH
                    ? [
                          {
                              id: 'publish',
                              label: 'COMMON.PUBLISH',
                              icon: 'pi pi-check',
                              disabled: !permission.authorization.canPublish,
                              tooltip: permission.authorization.canPublish
                                  ? this.t(
                                        'CONTENT_MANAGEMENT.LEGAL_NOTICE.TOOLTIP.PUBLISH'
                                    )
                                  : permission.tooltip.publish,
                          },
                      ]
                    : [
                          {
                              id: 'unpublish',
                              label: 'COMMON.UNPUBLISH',
                              icon: 'pi pi-times',
                              disabled: !permission.authorization.canUnpublish,
                              tooltip: permission.authorization.canUnpublish
                                  ? this.t(
                                        'CONTENT_MANAGEMENT.LEGAL_NOTICE.TOOLTIP.UNPUBLISH'
                                    )
                                  : permission.tooltip.unpublish,
                          },
                      ]),

                {
                    id: 'delete',
                    label: 'COMMON.DELETE',
                    icon: 'pi pi-trash',
                    disabled:
                        item.status === Status.PUBLISH ||
                        !permission.authorization.canDelete,
                    tooltip:
                        permission.authorization.canDelete &&
                        item.status !== Status.PUBLISH
                            ? this.t(
                                  'CONTENT_MANAGEMENT.LEGAL_NOTICE.TOOLTIP.DELETE'
                              )
                            : permission.tooltip.delete,
                },
            ],
            disableDropdown: !permission.authorization.canChoose,
            tooltipDropdown: permission.authorization.canChoose
                ? this.t('CONTENT_MANAGEMENT.LEGAL_NOTICE.TOOLTIP.CHOOSE')
                : permission.tooltip.choose,
        };
    }
}
