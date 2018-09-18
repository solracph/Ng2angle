import { NgModule } from '@angular/core';
import { AdminComponent } from './admin/admin.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AdminService } from './admin/admin.service';
import { RuleService } from '../rules/rules/rule.service';

const routes: Routes = [
    { path: '', component: AdminComponent },
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [AdminComponent],
    exports: [
        RouterModule
    ],
    providers: [
        AdminService,
        RuleService
    ]
})
export class AdminModule { }