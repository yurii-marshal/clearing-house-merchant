import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TransactionsInformationRoutingModule} from './transactions-information-routing.module';
import {TransactionsInformationComponent} from './transactions-information.component';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        TransactionsInformationRoutingModule
    ],
    declarations: [TransactionsInformationComponent]
})
export class TransactionsInformationModule {
}
