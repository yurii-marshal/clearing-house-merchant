import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {BillingReportsComponent} from "./billing-reports.component";

const routes: Routes = [
    {
        path: '', component: BillingReportsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BillingReportsRoutingModule {
}
