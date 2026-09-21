import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { PrivacyPolicyService } from '@shared/domain/services/privacy-policy.service';
import { SessionService } from '@shared/domain/services/session.service';

@Component({
    selector: 'app-privacy-policy-dialog',
    standalone: true,
    templateUrl: './privacy-policy-dialog.component.html',
    styleUrls: ['./privacy-policy-dialog.component.scss'],
    imports: [
        TranslateModule,
        DialogModule,
        CheckboxModule,
        ButtonModule,
        FormsModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicyDialogComponent implements OnInit {
    private readonly privacyPolicy = inject(PrivacyPolicyService);
    private readonly sessionService = inject(SessionService);

    readonly content = this.privacyPolicy.content;
    readonly saving = this.privacyPolicy.saving;
    readonly visible = this.privacyPolicy.mustAccept;

    readonly acknowledged = signal(false);
    readonly canContinue = computed(
        () => this.acknowledged() && !this.saving()
    );

    ngOnInit(): void {
        this.privacyPolicy.refresh();
    }

    onContinue(): void {
        if (!this.acknowledged() || this.saving()) {
            return;
        }
        this.privacyPolicy.accept();
    }

    onDisconnect(): void {
        this.sessionService.clear();
    }
}
