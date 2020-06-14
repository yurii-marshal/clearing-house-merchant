import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {FormsModule} from "@angular/forms";
import {MatTabsModule} from "@angular/material";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {NgSelectModule} from "@ng-select/ng-select";
import {TranslateModule} from "@ngx-translate/core";
import {PipesModule} from "../../pipes.module";
import {BillingReportsComponent} from "./billing-reports.component";
import {BillingReportsRoutingModule} from "./billing-reports-routing.module";

@NgModule({
  imports: [
      CommonModule,
      PipesModule,
      TranslateModule,
      BillingReportsRoutingModule,
      NgbModule.forRoot(),
      MatTabsModule,
      FormsModule,
      NgSelectModule

  ],
  declarations: [BillingReportsComponent]
})
export class BillingReportsModule { }
