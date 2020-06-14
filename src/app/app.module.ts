import {NgModule, APP_INITIALIZER} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {environment} from '../environments/environment';

import {CallApiComponent} from './call-api/call-api.component';
import {
    AuthModule,
    OidcSecurityService,
    OpenIDImplicitFlowConfiguration,
    OidcConfigService,
    AuthWellKnownEndpoints
} from 'angular-auth-oidc-client';

import {UnauthorizedComponent} from './components/unauthorized/unauthorized.component';
import {AuthorizationGuard} from './authorization.guard';
import {AutoLoginComponent} from './components/auto-login/auto-login.component';
import {DashboardModule} from "./components/dashboard/dashboard.module";
import {ShellModule} from "./components/shell.module";
import {httpInterceptorProviders} from './services/http-interceptors';
import {TransactionApiService} from "./services/api/transaction-api.service";
import {ChargebackApiService} from "./services/api/chargeback-api.service";
import {DocumentApiService} from "./services/api/document-api.service";
import {StatusApiService} from "./services/api/status-api.service";
import {ValuesApiService} from "./services/api/values-api.service";
import {RequestsService} from "./services/http-interceptors/requests.service";
import {PipesModule} from "./pipes.module";
import {DictionariesService} from "./services/api/dictionaries-api.service";
import {FiltersService} from "./services/filters.service";
import {DashboardApiService} from "./services/api/dashboard-api.service";
import {TransitionsService} from "./services/transitions.service";
import {UserApiService} from "./services/api/user-api.service";
import {ReportsApiService} from "./services/api/reports-api.service";
import {MerchantApiService} from "./services/api/merchant-api.service";
import {LocalstorageService} from "./services/localstorage.service";
import {ToastrModule} from "ngx-toastr";
import {ClickOutsideDirective} from "./services/click-outside.directive";

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
    // for development
    // return new TranslateHttpLoader(http, '/start-angular/SB-Admin-BS4-Angular-5/master/dist/assets/i18n/', '.json');
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function loadConfig(oidcConfigService: OidcConfigService) {
    console.log('APP_INITIALIZER STARTING');

    return () => oidcConfigService.load_using_stsServer(environment.load_using_stsServer);
    //return () => oidcConfigService.load_using_stsServer('http://localhost:5000/');

}

@NgModule({
    imports: [
        CommonModule,
        ShellModule,
        DashboardModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        AppRoutingModule,
        AuthModule.forRoot(),
        ToastrModule.forRoot(),
        PipesModule,
    ],
    declarations: [
        AppComponent,
        CallApiComponent,
        UnauthorizedComponent,
        AutoLoginComponent
    ],
    providers: [
        HttpClientModule,
        OidcSecurityService,
        OidcConfigService,
        RequestsService,
        LocalstorageService,
        MerchantApiService,
        TransitionsService,
        UserApiService,
        DashboardApiService,
        TransactionApiService,
        ChargebackApiService,
        DocumentApiService,
        ReportsApiService,
        StatusApiService,
        DictionariesService,
        FiltersService,
        ValuesApiService,
        {
            provide: APP_INITIALIZER,
            useFactory: loadConfig,
            deps: [OidcConfigService],
            multi: true
        },
        AuthorizationGuard,
        httpInterceptorProviders
    ],
    bootstrap: [AppComponent]
})

export class AppModule {

    constructor(private oidcSecurityService: OidcSecurityService,
                private oidcConfigService: OidcConfigService,) {
        this.oidcConfigService.onConfigurationLoaded.subscribe(() => {

            const openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();

            openIDImplicitFlowConfiguration.stsServer = environment.openIDImplicitFlowConfiguration.stsServer;
            openIDImplicitFlowConfiguration.redirect_url = environment.openIDImplicitFlowConfiguration.redirect_url;
            openIDImplicitFlowConfiguration.client_id = environment.openIDImplicitFlowConfiguration.client_id;
            openIDImplicitFlowConfiguration.response_type = environment.openIDImplicitFlowConfiguration.response_type;
            openIDImplicitFlowConfiguration.scope = environment.openIDImplicitFlowConfiguration.scope;
            openIDImplicitFlowConfiguration.post_logout_redirect_uri = environment.openIDImplicitFlowConfiguration.post_logout_redirect_uri;
            openIDImplicitFlowConfiguration.post_login_route = environment.openIDImplicitFlowConfiguration.post_login_route;
            openIDImplicitFlowConfiguration.forbidden_route = environment.openIDImplicitFlowConfiguration.forbidden_route;
            // openIDImplicitFlowConfiguration.unauthorized_route = environment.openIDImplicitFlowConfiguration.unauthorized_route;
            openIDImplicitFlowConfiguration.trigger_authorization_result_event = environment.openIDImplicitFlowConfiguration.trigger_authorization_result_event;
            openIDImplicitFlowConfiguration.auto_userinfo = environment.openIDImplicitFlowConfiguration.auto_userinfo;
            openIDImplicitFlowConfiguration.log_console_warning_active = environment.openIDImplicitFlowConfiguration.log_console_warning_active;
            openIDImplicitFlowConfiguration.log_console_debug_active = !environment.production;
            openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds = environment.openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds;

            const authWellKnownEndpoints = new AuthWellKnownEndpoints();
            authWellKnownEndpoints.setWellKnownEndpoints(this.oidcConfigService.wellKnownEndpoints);
            this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration, authWellKnownEndpoints);
        });

        console.log('APP STARTING');
    }
}