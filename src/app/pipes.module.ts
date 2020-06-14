import {NgModule} from "@angular/core";
import {UtcToLocalDatePipe} from "./pipes/utc-to-local-date.pipe";
import {KeysPipe} from "./pipes/object-values.pipe";
import {GetValueFromDictionaryPipe} from "./pipes/get-value-from-dictionary.pipe";

@NgModule({
    imports: [],
    declarations: [
        KeysPipe,
        UtcToLocalDatePipe,
        GetValueFromDictionaryPipe,
    ],
    exports: [
        KeysPipe,
        UtcToLocalDatePipe,
        GetValueFromDictionaryPipe,
    ],
})

export class PipesModule {
}