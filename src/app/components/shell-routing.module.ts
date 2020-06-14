import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ShellComponent} from "./shell.component";

const routes: Routes = [
    {
        path: '',
        component: ShellComponent,
        children: [
            {
                path: 'dashboard',
                loadChildren: './dashboard/dashboard.module#DashboardModule'
            },
            {
                path: 'profile-details',
                loadChildren: './profile-details/profile-details.module#ProfileDetailsModule'
            },
            {
                path: 'transaction-reports',
                loadChildren: './transaction-reports/transaction-reports.module#TransactionReportsModule'
            },
            {
                path: 'billing-reports',
                loadChildren: './billing-reports/billing-reports.module#BillingReportsModule'
            },
            {
                path: 'transactions',
                loadChildren: './transactions/transactions.module#TransactionsModule'
            },
            {
                path: 'transactions/:id',
                loadChildren: './transactions/transactions-information/transactions-information.module#TransactionsInformationModule'
            },
            // {
            //     path: '', redirectTo: 'dashboard'
            // },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ShellRoutingModule {
}
