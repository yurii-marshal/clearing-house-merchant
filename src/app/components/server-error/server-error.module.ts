import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ServerErrorRoutingModule} from './server-error-routing.module';
import {ServerErrorComponent} from './server-error.component';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        ServerErrorRoutingModule
    ],
    declarations: [ServerErrorComponent]
})
export class ServerErrorModule {
}
