import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "app-dossier-demande-integration",
    templateUrl: "./dossier-demande-integration.component.html",
    styleUrls: ["./dossier-demande-integration.component.scss"]
})

export class DossierDemandeIntegrationComponent implements OnInit {
    
    public module: string;
    public subModule: string;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit(): void {
        this.initPage();
    }

    private initPage(): void {
        // this.subscriptionRouter = this.router.events.pipe(
        //     filter(event => event instanceof NavigationEnd)
        // ).subscribe((event: NavigationEnd) => {
        //     if (!event.urlAfterRedirects.includes('cartes-sim')) {
        //         this.resetState();
        //     }
        // });
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[0];
        });
    }
}