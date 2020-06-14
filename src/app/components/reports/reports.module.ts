import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import {FormsModule} from "@angular/forms";
import {MatTabsModule} from "@angular/material";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {NgSelectModule} from "@ng-select/ng-select";
import {TranslateModule} from "@ngx-translate/core";
import {PipesModule} from "../../pipes.module";

@NgModule({
  imports: [
      CommonModule,
      PipesModule,
      TranslateModule,
      ReportsRoutingModule,
      NgbModule.forRoot(),
      MatTabsModule,
      FormsModule,
      NgSelectModule

  ],
  declarations: [ReportsComponent]
})
export class ReportsModule { }
