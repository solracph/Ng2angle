import { NgModule } from '@angular/core';
import { RulesComponent } from './rules/rules.component';
import { DialogRuleCloneComponent } from './rules/dialog/dialog-rule-clone.component';
import { DialogEditConstraintsComponent } from './rules/dialog/dialog-edit-constraints.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { RuleService } from './rules/rule.service';
import { MaterialTablePaginatorFilterModule } from '../../common/component/material-table/material-table-paginator-filter.module'; 

const routes: Routes = [
    { path: '', component: RulesComponent },
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        MaterialTablePaginatorFilterModule
    ],
    declarations: [RulesComponent,DialogRuleCloneComponent,DialogEditConstraintsComponent],
    entryComponents: [DialogRuleCloneComponent,DialogEditConstraintsComponent],
    exports: [
        RouterModule
    ],
    providers: [
        RuleService
    ]
})
export class RulesModule { }