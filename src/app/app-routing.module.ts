import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UnauthorizedComponent} from './components/unauthorized/unauthorized.component';
import {AutoLoginComponent} from './components/auto-login/auto-login.component';
import {AuthorizationGuard} from "./authorization.guard";

const routes: Routes = [

    {
        path: 'error',
        loadChildren: './components/server-error/server-error.module#ServerErrorModule'
    },
    {
        path: 'access-denied',
        loadChildren: './components/access-denied/access-denied.module#AccessDeniedModule'
    },
    {
        path: 'not-found',
        loadChildren: './components/not-found/not-found.module#NotFoundModule',
    },
    {
        path: 'autologin',
        component: AutoLoginComponent
    },

    {
        path: '**',
        redirectTo: 'not-found'
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
