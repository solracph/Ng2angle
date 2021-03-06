import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppConfiguration } from './app.configuration';
import { AppComponent } from './app.component';
import { AppState } from './app.state';

import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { SharedModule } from './shared/shared.module';
import { RoutesModule } from './routes/routes.module';

import { MaterialTableHelper } from './common/service/material-table-helper.service'

import { AlertDialogComponent } from './common/dialog/alert/alert-dialog.component';
import { DialogYesNoComponent } from './common/dialog/yesOrNo/dialog-yes-or-no.component';


// https://github.com/ocombe/ng2-translate/issues/218
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        AlertDialogComponent,
        DialogYesNoComponent
    ],
    entryComponents: [AlertDialogComponent,DialogYesNoComponent],
    imports: [
        HttpClientModule,
        BrowserAnimationsModule, // required for ng2-tag-input
        CoreModule,
        LayoutModule,
        SharedModule.forRoot(),
        RoutesModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        })
    ],
    providers: [
        AppState,
        MaterialTableHelper,
        AppConfiguration
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
