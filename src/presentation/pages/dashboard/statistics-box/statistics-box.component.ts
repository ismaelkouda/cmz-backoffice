import { Component, Input } from "@angular/core";

@Component({
  selector: "app-statistics-box",
  templateUrl: "./statistics-box.component.html",
  styleUrls: ["./statistics-box.component.scss"],
})
export class StatisticsBoxComponent {

  @Input() cardBgColor: any;
  @Input() cardBorderColor: any;
  @Input() legendColor: any;
  @Input() countColor: any;
  @Input() legend: string;
  @Input() count: any;

  constructor() { }

  ngOnInit(): void {
  }

  pipeValue(number: any) {
    return new Intl.NumberFormat('fr-FR').format(number);
  }

}
