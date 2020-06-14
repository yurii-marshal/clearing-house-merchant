import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {FormsModule} from "@angular/forms";
import {MatTabsModule} from "@angular/material";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {NgSelectModule} from "@ng-select/ng-select";
import {TranslateModule} from "@ngx-translate/core";
import {PipesModule} from "../../pipes.module";
import {TransactionReportsComponent} from "./transaction-reports.component";
import {TransactionReportsRoutingModule} from "./transaction-reports-routing.module";

@NgModule({
  imports: [
      CommonModule,
      PipesModule,
      TranslateModule,
      TransactionReportsRoutingModule,
      NgbModule.forRoot(),
      MatTabsModule,
      FormsModule,
      NgSelectModule
  ],
  declarations: [TransactionReportsComponent]
})
export class TransactionReportsModule { }
