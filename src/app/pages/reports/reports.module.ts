import { NgModule } from '@angular/core';
import { SharedModule } from "../../shared/shared.module";
import { ChartModule } from "primeng/chart";

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports/reports.component';

@NgModule({
  declarations: [ReportsComponent],
  imports: [
    SharedModule,
    ReportsRoutingModule,
    ChartModule
  ]
})
export class ReportsModule { }
