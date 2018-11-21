import { NgModule } from '@angular/core';
import { RulesAsigmentsComponent } from './rules-asigments/rules-asigments.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { RulesAsigmentsService } from './rules-asigments/rules-asigments.service';
import { RuleService } from '../rules/rules/rule.service';

const routes: Routes = [
    { path: '', component: RulesAsigmentsComponent },
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [RulesAsigmentsComponent],
    exports: [
        RouterModule
    ],
    providers: [
        RulesAsigmentsService,
        RuleService
    ]
})
export class RulesAsigmentsModule { }