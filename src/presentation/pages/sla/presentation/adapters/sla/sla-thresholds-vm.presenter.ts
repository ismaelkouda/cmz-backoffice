import { SlaThresholdEntity } from '@pages/sla/domain/entities/sla/sla-threshold.entity';
import { SLA_SERVICES } from '@pages/sla/presentation/adapters/sla/sla-services.constant';
import { SlaThresholdsVmProps } from '@pages/sla/presentation/adapters/sla/sla-thresholds-vm-props.interface';

export class SlaThresholdsVmPresenter {
    constructor(private readonly translate: (key: string) => string) {}

    map(item: SlaThresholdEntity): SlaThresholdsVmProps {
        return {
            id: item.id,
            slaId: item.slaId,
            slaType: item.slaType,
            slaTypeLabel: this.getServiceLabel(item.slaType),
            slaName: item.slaName,
            description: item.description,
            slaCategoryLabel: this.translate(
                item.slaCategory === 'system'
                    ? 'SLA.SLA_LIST.CATEGORY.SYSTEM'
                    : 'SLA.SLA_LIST.CATEGORY.JOB'
            ),
            threshold: item.threshold,
            thresholdType: item.thresholdType,
            thresholdLabel: item.thresholdLabel,
            criticalThreshold: item.criticalThreshold,
            criticalThresholdType: item.criticalThresholdType,
            criticalThresholdLabel: item.criticalThresholdLabel,
            channel: item.channel,
            channelLabel: this.getChannelLabel(item.channel),
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        };
    }

    private getServiceLabel(service: string): string {
        const option = SLA_SERVICES.find((item) => item.value === service);
        return option ? this.translate(option.translationKey) : service;
    }

    private getChannelLabel(channel: string): string {
        const normalizedChannel = channel.toLowerCase().replaceAll(' ', '_');
        const key = `SLA.CHANNELS.${normalizedChannel.toUpperCase()}`;
        const translated = this.translate(key);
        return translated === key ? channel : translated;
    }
}
