import { NgModule } from '@angular/core';
import { RulesComponent } from './rules/rules.component';
import { DialogRuleCloneComponent } from './rules/dialog/dialog-application-required.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { RuleService } from './rules/rule.service';
import { AlertDialogComponent } from '../../common/dialog/alert/alert-dialog.component';


const routes: Routes = [
    { path: '', component: RulesComponent },
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [RulesComponent,DialogRuleCloneComponent, AlertDialogComponent],
    entryComponents: [DialogRuleCloneComponent, AlertDialogComponent],
    exports: [
        RouterModule
    ],
    providers: [
        RuleService
    ]
})
export class RulesModule { }