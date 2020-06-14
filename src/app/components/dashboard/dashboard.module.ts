import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {NgbCarouselModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard.component';
import {StatModule} from '../../common-components/stat/stat.module';
import {
    TimelineComponent,
    NotificationComponent,
    ChatComponent
} from './components';
import {ChartsModule} from 'ng2-charts';
import {LastTransactionsComponent} from './components/last-transactions/last-transactions.component';
import {CardAmountsComponent} from './components/card-amounts/card-amounts.component';
import {ChartTransactionsComponent} from './components/chart-transactions/chart-transactions.component';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        NgbCarouselModule.forRoot(),
        NgbAlertModule.forRoot(),
        DashboardRoutingModule,
        StatModule,
        TranslateModule,
        ChartsModule
    ],
    declarations: [
        DashboardComponent,
        TimelineComponent,
        NotificationComponent,
        ChatComponent,
        LastTransactionsComponent,
        CardAmountsComponent,
        ChartTransactionsComponent
    ],
    providers: [DatePipe]
})
export class DashboardModule {
}
