import { LayoutComponent } from '../layout/layout.component';

export const routes = [

    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'rules', pathMatch: 'full' },
            { path: 'home', loadChildren: './home/home.module#HomeModule' },
            { path: 'rules-asigments', loadChildren: './rules-asigments/rules-asigments.module#RulesAsigmentsModule' },
            { path: 'rules', loadChildren: './rules/rules.module#RulesModule' },
            { path: 'material', loadChildren: './material/material.module#MaterialModule' },
        ]
    },

    // Not found
    { path: '**', redirectTo: 'rules' }

];
