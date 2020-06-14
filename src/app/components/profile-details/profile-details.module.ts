import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import {ProfileDetailsRoutingModule} from './profile-details-routing.module';
import {ProfileDetailsComponent} from './profile-details.component';
import {PageHeaderModule} from "../../common-components/page-header/page-header.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        ProfileDetailsRoutingModule,
        PageHeaderModule,
        NgbModule.forRoot(),
        FormsModule,
        NgSelectModule
    ],
    declarations: [
        ProfileDetailsComponent
    ],
    providers: [DatePipe]
})
export class ProfileDetailsModule {

    public model: any;
}
