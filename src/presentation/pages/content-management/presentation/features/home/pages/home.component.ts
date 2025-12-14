import { AsyncPipe, CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CREATE_ROUTE, EDIT_ROUTE, VIEW_ROUTE } from '@presentation/pages/content-management/content-management.routes';
import { HomeFacade } from '@presentation/pages/content-management/core/application/services/home.facade';
import { HomeEntity } from '@presentation/pages/content-management/core/domain/entities/home.entity';
import { HomeFilterPayloadEntity } from '@presentation/pages/content-management/core/domain/entities/home/home-filter-payload.entity';
import { HomeFilter } from '@presentation/pages/content-management/core/domain/value-objects/home-filter.vo';
import { FilterHomeComponent } from '@presentation/pages/content-management/presentation/features/home/filter-home/filter-home.component';
import { TableHomeComponent } from '@presentation/pages/content-management/presentation/features/home/table-home/table-home.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule,
    BreadcrumbComponent,
    FilterHomeComponent,
    TableHomeComponent,
    PageTitleComponent,
    PaginationComponent,
    TranslateModule,
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly title = inject(Title);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly translate = inject(TranslateService);
  private readonly homeFacade = inject(HomeFacade);
  public module: string = this.translate.instant('CONTENT_MANAGEMENT.LABEL');
  public subModule: string = this.translate.instant('CONTENT_MANAGEMENT.HOME.LABEL');
  public home$: Observable<HomeEntity[]> = this.homeFacade.home$;
  public pagination$: Observable<Paginate<HomeEntity>> = this.homeFacade.pagination$;
  public loading$: Observable<boolean> = this.homeFacade.isLoading$;
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.setupMeta();
    this.loadData();
  }

  private loadData(): void {
    const defaultFilter = HomeFilter.create();
    this.homeFacade.fetchHome(defaultFilter, '1', false);
  }

  private setupMeta(): void {
    this.title.setTitle(this.translate.instant('CONTENT_MANAGEMENT.HOME.TITLE'));
  }

  public filter(filterData: HomeFilterPayloadEntity): void {
    const filter = HomeFilter.create({
      ...filterData,
      status: filterData.status ?? undefined
    });
    this.homeFacade.fetchHome(filter, '1', true);
  }

  public onPageChange(event: number): void {
    this.homeFacade.changePage(event + 1);
  }

  public refreshHome(): void {
    this.homeFacade.refresh();
  }

  public onCreateClicked(): void {
    this.router.navigate([CREATE_ROUTE], { relativeTo: this.activatedRoute });
  }

  public onEditClicked(item: HomeEntity): void {
    this.router.navigate([item.uniqId, EDIT_ROUTE], { relativeTo: this.activatedRoute });
  }

  public onViewClicked(item: HomeEntity): void {
    this.router.navigate([item.uniqId, VIEW_ROUTE], { relativeTo: this.activatedRoute });
  }

  public onEnableClicked(item: HomeEntity): void {
    this.homeFacade.enableHome(item.uniqId).subscribe();
  }

  public onDisableClicked(item: HomeEntity): void {
    this.homeFacade.disableHome(item.uniqId).subscribe();
  }

  public onDeleteClicked(item: HomeEntity): void {
    this.homeFacade.deleteHome(item.uniqId).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
