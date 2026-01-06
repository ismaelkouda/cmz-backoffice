import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SLIDE_ROUTE } from '@presentation/pages/content-management/content-management.routes';
import { SlideFacade } from '@presentation/pages/content-management/core/application/services/slide.facade';
import { SlideEntity } from '@presentation/pages/content-management/core/domain/entities/slide.entity';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { Observable, switchMap } from 'rxjs';

@Component({
    selector: 'app-view-slide',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        BreadcrumbComponent,
        ButtonModule,
        CardModule,
        TagModule,
        ChipModule,
    ],
    template: `
        <main class="container-fluid p-4">
            <app-breadcrumb />

            <div class="card border-0 shadow-sm rounded-4 mt-3">
                <div
                    class="card-header bg-white p-3 border-bottom-0 d-flex justify-content-between align-items-center"
                >
                    <h5 class="mb-0 fw-bold">
                        {{ 'CONTENT_MANAGEMENT.SLIDE.VIEW.TITLE' | translate }}
                    </h5>
                    <p-button
                        label="{{ 'COMMON.CLOSE' | translate }}"
                        icon="pi pi-times"
                        styleClass="p-button-text p-button-secondary"
                        (click)="onBack()"
                    ></p-button>
                </div>
                <div class="card-body p-4">
                    @if (slide$ | async; as slide) {
                        <div class="row g-4">
                            <div class="col-md-4">
                                @if (slide.imageFile) {
                                    <img
                                        [src]="slide.imageFile"
                                        class="img-fluid rounded shadow-sm mb-3"
                                        alt="Slide Image"
                                    />
                                } @else if (slide.videoUrl) {
                                    <video
                                        [src]="slide.videoUrl"
                                        controls
                                        class="img-fluid rounded shadow-sm mb-3"
                                    ></video>
                                }
                            </div>
                            <div class="col-md-8">
                                <div class="d-flex align-items-center mb-3">
                                    <h2 class="fw-bold mb-0 me-3">
                                        {{ slide.title }}
                                    </h2>
                                    <p-tag
                                        [severity]="
                                            slide.isActive
                                                ? 'success'
                                                : 'danger'
                                        "
                                        [value]="
                                            (slide.isActive
                                                ? 'COMMON.ACTIVE'
                                                : 'COMMON.INACTIVE'
                                            ) | translate
                                        "
                                    ></p-tag>
                                </div>
                                <h5 class="text-muted mb-3">
                                    {{ slide.subtitle }}
                                </h5>
                                <div
                                    [innerHTML]="slide.description"
                                    class="mb-4 text-secondary"
                                ></div>

                                <div class="row g-3">
                                    <div class="col-6 col-md-3">
                                        <small class="text-muted d-block">{{
                                            'CONTENT_MANAGEMENT.SLIDE.FORM.TYPE'
                                                | translate
                                        }}</small>
                                        <span class="fw-semibold">{{
                                            slide.type
                                        }}</span>
                                    </div>
                                    <div class="col-6 col-md-3">
                                        <small class="text-muted d-block">{{
                                            'CONTENT_MANAGEMENT.SLIDE.FORM.DURATION'
                                                | translate
                                        }}</small>
                                        <span class="fw-semibold"
                                            >{{
                                                slide.timeDurationInSeconds
                                            }}s</span
                                        >
                                    </div>
                                    <div class="col-6 col-md-3">
                                        <small class="text-muted d-block">{{
                                            'CONTENT_MANAGEMENT.SLIDE.FORM.ORDER'
                                                | translate
                                        }}</small>
                                        <span class="fw-semibold">{{
                                            slide.order
                                        }}</span>
                                    </div>
                                    <div class="col-6 col-md-3">
                                        <small class="text-muted d-block">{{
                                            'CONTENT_MANAGEMENT.SLIDE.FORM.PLATFORMS'
                                                | translate
                                        }}</small>
                                        <div
                                            class="d-flex gap-1 flex-wrap mt-1"
                                        >
                                            @for (
                                                p of slide.platforms;
                                                track p
                                            ) {
                                                <p-chip
                                                    [label]="p | uppercase"
                                                    styleClass="text-xs"
                                                ></p-chip>
                                            }
                                        </div>
                                    </div>
                                </div>

                                <hr class="my-4" />

                                <div class="d-flex gap-3">
                                    <div>
                                        <small
                                            class="text-muted d-block mb-1"
                                            >{{
                                                'CONTENT_MANAGEMENT.SLIDE.FORM.BUTTON_LABEL'
                                                    | translate
                                            }}</small
                                        >
                                        <p-tag
                                            severity="info"
                                            [value]="slide.buttonLabel"
                                        ></p-tag>
                                    </div>
                                    <div>
                                        <small
                                            class="text-muted d-block mb-1"
                                            >{{
                                                'CONTENT_MANAGEMENT.SLIDE.FORM.BUTTON_URL'
                                                    | translate
                                            }}</small
                                        >
                                        <a
                                            [href]="slide.buttonUrl"
                                            target="_blank"
                                            class="text-decoration-none"
                                            >{{ slide.buttonUrl }}</a
                                        >
                                    </div>
                                </div>

                                <hr class="my-4" />

                                <div class="row">
                                    <div class="col-6">
                                        <small class="text-muted d-block">{{
                                            'CONTENT_MANAGEMENT.SLIDE.FORM.START_DATE'
                                                | translate
                                        }}</small>
                                        <span>{{
                                            slide.startDate | date: 'medium'
                                        }}</span>
                                    </div>
                                    <div class="col-6">
                                        <small class="text-muted d-block">{{
                                            'CONTENT_MANAGEMENT.SLIDE.FORM.END_DATE'
                                                | translate
                                        }}</small>
                                        <span>{{
                                            slide.endDate | date: 'medium'
                                        }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </main>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewSlideComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly facade = inject(SlideFacade);

    slide$!: Observable<SlideEntity>;

    ngOnInit() {
        this.slide$ = this.route.params.pipe(
            switchMap((params) => this.facade.getSlideById(params['id']))
        );
    }

    onBack() {
        this.router.navigate([SLIDE_ROUTE]);
    }
}
