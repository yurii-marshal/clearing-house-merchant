import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StatComponent} from './stat.component';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [CommonModule, TranslateModule],
    declarations: [StatComponent],
    exports: [StatComponent]
})
export class StatModule {
}
