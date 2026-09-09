import { Component, computed, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
    PASSWORD_RULES,
    PasswordRule,
} from '@shared/presentation/helpers/password-validators.helper';

type StrengthLevel = 'VERY_WEAK' | 'WEAK' | 'FAIR' | 'GOOD' | 'STRONG';

interface StrengthRule extends PasswordRule {
    met: boolean;
}

@Component({
    selector: 'app-password-strength',
    standalone: true,
    templateUrl: './password-strength.component.html',
    styleUrl: './password-strength.component.scss',
    imports: [TranslateModule],
})
export class PasswordStrengthComponent {
    readonly value = input<string>('');
    readonly email = input<string>('');

    readonly rules = computed<StrengthRule[]>(() => {
        const value = this.value();
        const email = this.email().trim().toLowerCase();
        const emailRules: StrengthRule[] = email
            ? [
                  {
                      key: 'NOT_EMAIL',
                      test: () => value.trim().toLowerCase() !== email,
                      met: !!value && value.trim().toLowerCase() !== email,
                  },
              ]
            : [];

        return [
            ...PASSWORD_RULES.map((rule) => ({
                ...rule,
                met: rule.test(value),
            })),
            ...emailRules,
        ];
    });

    readonly metCount = computed(
        () => this.rules().filter((rule) => rule.met).length
    );
    readonly totalCount = computed(() => this.rules().length);
    readonly segments = computed(() =>
        Array.from(
            { length: this.totalCount() },
            (_, index) => index < this.metCount()
        )
    );

    readonly score = computed(() =>
        this.totalCount() ? this.metCount() / this.totalCount() : 0
    );
    readonly level = computed<StrengthLevel>(() => {
        const score = this.score();
        if (score >= 0.8) {
            return 'STRONG';
        }
        if (score >= 0.6) {
            return 'GOOD';
        }
        if (score >= 0.4) {
            return 'FAIR';
        }
        if (score >= 0.2) {
            return 'WEAK';
        }
        return 'VERY_WEAK';
    });
    readonly hostClass = computed(
        () =>
            `password-strength password-strength--level-${this.level()
                .toLowerCase()
                .replace('_', '-')}`
    );
}
