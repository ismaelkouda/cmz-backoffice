import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule, RouterOutlet } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { REGIONS_TABS } from "@presentation/pages/administrative-boundary/core/domain/constants/regions/regions-tabs.constants";
import { BreadcrumbComponent } from "@shared/components/breadcrumb/breadcrumb.component";
import { PageTitleComponent } from "@shared/components/page-title/page-title.component";
import { ADMINISTRATIVE_BOUNDARY_ROUTE } from "@shared/routes/routes";
import { TabsModule } from "primeng/tabs";

@Component(
    {
        selector: "app-regions-page",
        standalone: true,
        imports: [CommonModule, BreadcrumbComponent, PageTitleComponent, TabsModule, TranslateModule, RouterModule, RouterOutlet],
        templateUrl: "./regions-page.component.html",
        styleUrls: ["./regions-page.component.scss"],
    }
)
export class RegionsPageComponent {
    public readonly tabs = REGIONS_TABS;
    public readonly route = ADMINISTRATIVE_BOUNDARY_ROUTE;
} 