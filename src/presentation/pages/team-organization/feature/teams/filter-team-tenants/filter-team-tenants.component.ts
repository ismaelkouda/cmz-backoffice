import {
    Component,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
    inject,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { Subject } from 'rxjs';

export interface TeamTenantsFilterFormInterface {
    code: FormControl<string>;
}

export interface TeamTenantsFilterInterface {
    code?: string;
}

@Component({
    selector: 'app-filter-team-tenants',
    standalone: true,
    templateUrl: './filter-team-tenants.component.html',
    styleUrls: ['./filter-team-tenants.component.scss'],
    imports: [
        ReactiveFormsModule,
        TranslateModule,
        InputTextModule,
        ButtonModule,
        RippleModule,
    ],
})
export class FilterTeamTenantsComponent implements OnInit, OnDestroy {
    @Output() filter = new EventEmitter<TeamTenantsFilterInterface>();

    public formFilter!: FormGroup<TeamTenantsFilterFormInterface>;
    private readonly destroy$ = new Subject<void>();
    private readonly toastService = inject(ToastrService);
    private readonly fb = inject(FormBuilder);

    ngOnInit(): void {
        this.initFormFilter();
    }

    public initFormFilter(): void {
        if (!this.formFilter) {
            this.formFilter = this.fb.group<TeamTenantsFilterFormInterface>({
                code: new FormControl<string>('', {
                    nonNullable: true,
                }),
            });
        }
    }

    public onSubmitFilterForm(): void {
        const filterData: TeamTenantsFilterInterface = {
            code: this.formFilter.get('code')?.value?.trim() ?? '',
        };

        if (this.formFilter.valid) {
            this.filter.emit(filterData);
        } else {
            const translatedMessage = 'FORM_INVALID';
            this.toastService.error(translatedMessage);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
