import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslatorService } from '../core/translator/translator.service';
import { MenuService } from '../core/menu/menu.service';
import { SharedModule } from '../shared/shared.module';

import { RulesModule } from './rules/rules.module';
import { AdminModule } from './admin/admin.module';


import { menu } from './menu';
import { routes } from './routes';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forRoot(routes),
        RulesModule,
        AdminModule
    ],
    declarations: [],
    exports: [
        RouterModule
    ]
})

export class RoutesModule {
    constructor(public menuService: MenuService, tr: TranslatorService) {
        menuService.addMenu(menu);
    }
}
