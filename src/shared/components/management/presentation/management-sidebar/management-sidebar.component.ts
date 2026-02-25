import { CommonModule } from '@angular/common';
import {
    Component,
    input,
    output,
    computed,
    ChangeDetectionStrategy,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-management-sidebar',
    standalone: true,
    imports: [
        CommonModule,
        SkeletonModule,
        TranslateModule,
        ButtonModule,
        TooltipModule,
    ],
    templateUrl: './management-sidebar.component.html',
    styleUrls: ['./management-sidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementSidebarComponent {
    public readonly item = input.required<any>();
    public readonly uniqId = input.required<string>();
    public readonly loading = input.required<boolean>();
    public readonly submitting = input<boolean>(false);

    public readonly submitAction = output();
    public readonly copyItem = output<string>();

    protected readonly showTakeButton = computed((): boolean => {
        return !!this.item()?.canBeTaken;
    });

    protected readonly getActionLabel = computed((): string => {
        const item = this.item();
        if (item?.canBeTaken) {
            return 'MANAGEMENT.SIDEBAR.ACTIONS.TAKE';
        }
        if (item?.canBeApproved) {
            return 'MANAGEMENT.SIDEBAR.ACTIONS.APPROVE';
        }
        if (item?.canBeTreated) {
            return 'MANAGEMENT.SIDEBAR.ACTIONS.TREAT';
        }
        if (item?.canBeFinalized) {
            return 'MANAGEMENT.SIDEBAR.ACTIONS.FINALIZE';
        }
        return 'MANAGEMENT.SIDEBAR.ACTIONS.PROCESS';
    });

    protected readonly showInitiatorSection = computed((): boolean => {
        return !!(this.item()?.treater?.createdAt || this.item()?.initiator);
    });

    protected readonly initiatorLastName = computed((): string => {
        return this.item()?.initiator?.lastName ?? '';
    });

    protected readonly initiatorFirstName = computed((): string => {
        return this.item()?.initiator?.firstName ?? '';
    });

    protected readonly initiatorPhone = computed((): string | null => {
        return this.item()?.initiator?.phone ?? null;
    });

    protected readonly showApproverSection = computed((): boolean => {
        return !!(this.item()?.treater?.approvedAt || this.item()?.approvedBy);
    });

    protected readonly approverLastName = computed((): string => {
        return this.item()?.approvedBy?.lastName ?? '';
    });

    protected readonly approverFirstName = computed((): string => {
        return this.item()?.approvedBy?.firstName ?? '';
    });

    protected readonly approverPhone = computed((): string | null => {
        return this.item()?.approvedBy?.phone ?? null;
    });

    protected readonly showRejecterSection = computed((): boolean => {
        return !!(this.item()?.treater?.rejectedAt || this.item()?.rejectedBy);
    });

    protected readonly rejecterLastName = computed((): string => {
        return this.item()?.rejectedBy?.lastName ?? '';
    });

    protected readonly rejecterFirstName = computed((): string => {
        return this.item()?.rejectedBy?.firstName ?? '';
    });

    protected readonly rejecterPhone = computed((): string | null => {
        return this.item()?.rejectedBy?.phone ?? null;
    });

    protected readonly showProcessorSection = computed((): boolean => {
        return !!(
            this.item()?.treater?.processedAt || this.item()?.processedBy
        );
    });

    protected readonly processorLastName = computed((): string => {
        return this.item()?.processedBy?.lastName ?? '';
    });

    protected readonly processorFirstName = computed((): string => {
        return this.item()?.processedBy?.firstName ?? '';
    });

    protected readonly processorPhone = computed((): string | null => {
        return this.item()?.processedBy?.phone ?? null;
    });
}
