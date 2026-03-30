import { SlideEntity } from '@pages/content-management/domain/entities/slide/slide.entity';
import { SlideVmProps } from '@pages/content-management/presentation/adapters/slide/slide-vm-props.interface';
import { Platform } from '@shared/domain/enums/platform.enum';

export class SlidePresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: SlideEntity): SlideVmProps {
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
        };
    }
}
