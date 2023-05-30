import { Component, Input } from "@angular/core";

@Component({
  selector: "app-statistics-box",
  templateUrl: "./statistics-box.component.html",
  styleUrls: ["./statistics-box.component.scss"],
})
export class StatisticsBoxComponent {

  @Input() data: any


  constructor() {}
}
