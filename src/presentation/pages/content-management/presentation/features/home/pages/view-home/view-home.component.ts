import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HomeFacade } from '@presentation/pages/content-management/core/application/services/home.facade';
import { HomeEntity } from '@presentation/pages/content-management/core/domain/entities/home.entity';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { map, Observable, switchMap } from 'rxjs';

@Component({
    selector: 'app-view-home',
    standalone: true,
    template: `
    <app-breadcrumb [title]="(title$ | async)!" [title]="module" [active_item]="subModule"></app-breadcrumb>
    <app-page-title [title]="(title$ | async)!"></app-page-title>

    @if (item$ | async; as item) {
      <div class="card">
        <h5>{{ item.title }}</h5>
        <p><strong>{{ 'COMMON.DESCRIPTION' | translate }}:</strong></p>
        <div [innerHTML]="item.description"></div>
        
        <div class="grid mt-3">
          <div class="col-12 md:col-6">
              <p><strong>{{ 'CONTENT_MANAGEMENT.HOME.FORM.SUBTITLE' | translate }}:</strong> {{ item.subtitle }}</p>
              <p><strong>{{ 'CONTENT_MANAGEMENT.HOME.FORM.TYPE' | translate }}:</strong> {{ item.type }}</p>
              <p><strong>{{ 'CONTENT_MANAGEMENT.HOME.FORM.VIDEO_URL' | translate }}:</strong> {{ item.videoUrl }}</p>
              <p><strong>{{ 'CONTENT_MANAGEMENT.HOME.FORM.BUTTON_LABEL' | translate }}:</strong> {{ item.buttonLabel }}</p>
              <p><strong>{{ 'CONTENT_MANAGEMENT.HOME.FORM.BUTTON_URL' | translate }}:</strong> {{ item.buttonUrl }}</p>
          </div>
          <div class="col-12 md:col-6">
              <p><strong>{{ 'CONTENT_MANAGEMENT.HOME.TABLE.STATUS' | translate }}:</strong> {{ item.isActive ? ('COMMON.ACTIVE' | translate) : ('COMMON.INACTIVE' | translate) }}</p>
              <p><strong>{{ 'CONTENT_MANAGEMENT.HOME.FORM.START_DATE' | translate }}:</strong> {{ item.startDate | date }}</p>
              <p><strong>{{ 'CONTENT_MANAGEMENT.HOME.FORM.END_DATE' | translate }}:</strong> {{ item.endDate | date }}</p>
              @if (item.imageFile) {
                <img [src]="item.imageFile" alt="Image" style="max-width: 100%; border-radius: 8px;">
              }
          </div>
        </div>
      </div>
    }
  `,
    imports: [
        CommonModule,
        TranslateModule,
        BreadcrumbComponent,
        PageTitleComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewHomeComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly homeFacade = inject(HomeFacade);

    public module: string = 'Content Management';
    public subModule: string = 'Home Blocks';

    title$ = this.route.data.pipe(map(data => data['title']));
    item$!: Observable<HomeEntity>;

    ngOnInit(): void {
        this.item$ = this.route.params.pipe(
            map(params => params['id']),
            switchMap(id => this.homeFacade.getHomeById(id))
        );
    }
}
