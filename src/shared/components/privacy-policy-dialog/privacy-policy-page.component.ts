import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { PrivacyPolicyService } from '@shared/domain/services/privacy-policy.service';
import { SessionService } from '@shared/domain/services/session.service';
import { DASHBOARD } from '@shared/routes/routes';

@Component({
    selector: 'app-privacy-policy-page',
    standalone: true,
    templateUrl: './privacy-policy-page.component.html',
    styleUrls: ['./privacy-policy-page.component.scss'],
    imports: [TranslateModule, CheckboxModule, ButtonModule, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicyPageComponent implements OnInit {
    private readonly privacyPolicy = inject(PrivacyPolicyService);
    private readonly sessionService = inject(SessionService);
    private readonly router = inject(Router);

    readonly content = this.privacyPolicy.content;
    readonly saving = this.privacyPolicy.saving;
    readonly mustAccept = this.privacyPolicy.mustAccept;

    readonly acknowledged = signal(false);
    readonly canContinue = computed(
        () => this.acknowledged() && !this.saving()
    );

    constructor() {
        effect(() => {
            if (!this.mustAccept()) {
                void this.router.navigate([DASHBOARD]);
            }
        });
    }

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
