import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { map, delay, withLatestFrom, filter } from 'rxjs/operators';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  // For Progressbar
  loaders = this.loader.progress$.pipe(
    delay(1000),
    withLatestFrom(this.loader.progress$),
    map(v => v[1]),
  );
  
  constructor(
    private router: Router,
    private titleService: Title,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
    private loader: LoadingBarService,
    private config: PrimeNGConfig, 
    private translateService: TranslateService
    ) {
      console.info(this.platformId)
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          const child: ActivatedRoute | null = this.route.firstChild;
          let title = child && child.snapshot.data['title'];
          if (title === undefined) {
            title = child.children[0].snapshot.data['title'];
          } else {
            title = title;
          }
          if (title) {
           return title;
          }
        })
      )
      .subscribe((title) => {
        if (title) {
          this.titleService.setTitle(`${title} - Cateli Data Collector - Système de Gestion de Collecte Centralisée`);
        }
      });
  }

  translate(lang: string) {
    this.translateService.use(lang);
    this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res));
}

}
