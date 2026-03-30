import { HomeEntity } from '@pages/content-management/domain/entities/home/home.entity';
import { HomeVmProps } from '@pages/content-management/presentation/adapters/home/home-vm-props.interface';
import { Platform } from '@shared/domain/enums/platform.enum';

export class HomePresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: HomeEntity): HomeVmProps {
        return {
            uniqId: item.uniqId,
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
