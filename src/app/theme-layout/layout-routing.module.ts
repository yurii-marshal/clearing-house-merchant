import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '', redirectTo: 'dashboard'
            },
            {
                path: 'dashboard', loadChildren: '../components/dashboard/dashboard.module#DashboardModule'
            },
            {
                path: 'profile-details', loadChildren: '../components/profile-details/profile-details.module#ProfileDetailsModule'
            },
            {
                path: 'reports', loadChildren: '../components/reports/reports.module#ReportsModule'
            },
            {
                path: 'transactions', loadChildren: '../components/transactions/transactions.module#TransactionsModule'
            },
            {
                path: 'transactions/:id',
                loadChildren: '../components/transactions/transactions-information/transactions-information.module#TransactionsInformationModule'
            },
            {
                path: 'charts', loadChildren: './charts/charts.module#ChartsModule'
            },
            {
                path: 'tables', loadChildren: './tables/tables.module#TablesModule'
            },
            {
                path: 'forms', loadChildren: './form/form.module#FormModule'
            },
            {
                path: 'bs-element', loadChildren: './bs-element/bs-element.module#BsElementModule'
            },
            {
                path: 'grid', loadChildren: './grid/grid.module#GridModule'
            },
            {
                path: 'components', loadChildren: './bs-component/bs-component.module#BsComponentModule'
            },
            {
                path: 'blank-page', loadChildren: './blank-page/blank-page.module#BlankPageModule'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {
}
