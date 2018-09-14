import { NgModule } from '@angular/core';
import { RulesComponent } from './rules/rules.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { RuleService } from './rules/rule.service';

const routes: Routes = [
    { path: '', component: RulesComponent },
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [RulesComponent],
    exports: [
        RouterModule
    ],
    providers: [
        RuleService
    ]
})
export class RulesModule { }