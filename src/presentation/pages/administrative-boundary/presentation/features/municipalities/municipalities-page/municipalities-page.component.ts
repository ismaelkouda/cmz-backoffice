import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { MUNICIPALITIES_TABS } from "@presentation/pages/administrative-boundary/core/domain/constants/municipalities/municipalities-tabs.constants";
import { BreadcrumbComponent } from "@shared/components/breadcrumb/breadcrumb.component";
import { PageTitleComponent } from "@shared/components/page-title/page-title.component";
import { ADMINISTRATIVE_BOUNDARY_ROUTE } from "@shared/routes/routes";
import { TabsModule } from "primeng/tabs";

@Component(
    {
        selector: "app-municipalities-page",
        standalone: true,
        imports: [CommonModule, BreadcrumbComponent, PageTitleComponent, TabsModule, TranslateModule, RouterOutlet],
        templateUrl: "./municipalities-page.component.html",
        styleUrls: ["./municipalities-page.component.scss"],
    }
)
export class MunicipalitiesPageComponent {
    public readonly tabs = MUNICIPALITIES_TABS;
    public readonly route = ADMINISTRATIVE_BOUNDARY_ROUTE;
}