import { PrivacyPolicyEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy.entity';
import { PrivacyPolicyVmProps } from '@pages/content-management/presentation/adapters/privacy-policy/privacy-policy-vm-props.interface';
import { Status } from '@presentation/pages/content-management/domain/enums/privacy-policy/privacy-policy-status.enum';

export class PrivacyPolicyPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(
        item: PrivacyPolicyEntity,
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
    ): PrivacyPolicyVmProps {
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
                        ? this.t(
                              'CONTENT_MANAGEMENT.PRIVACY_POLICY.TOOLTIP.EDIT'
                          )
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
                                        'CONTENT_MANAGEMENT.PRIVACY_POLICY.TOOLTIP.PUBLISH'
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
                                        'CONTENT_MANAGEMENT.PRIVACY_POLICY.TOOLTIP.UNPUBLISH'
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
                                  'CONTENT_MANAGEMENT.PRIVACY_POLICY.TOOLTIP.DELETE'
                              )
                            : permission.tooltip.delete,
                },
            ],
            disableDropdown: !permission.authorization.canChoose,
            tooltipDropdown: permission.authorization.canChoose
                ? this.t('CONTENT_MANAGEMENT.PRIVACY_POLICY.TOOLTIP.CHOOSE')
                : permission.tooltip.choose,
        };
    }
}
