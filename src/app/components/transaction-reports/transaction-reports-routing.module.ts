import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TransactionReportsComponent} from "./transaction-reports.component";

const routes: Routes = [
  {
    path: '', component: TransactionReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionReportsRoutingModule { }
