import { LayoutComponent } from '../layout/layout.component';

export const routes = [

    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'rules', loadChildren: './rules/rules.module#RulesModule' },
            { path: 'home', loadChildren: './home/home.module#HomeModule' },
            { path: 'material', loadChildren: './material/material.module#MaterialModule' },
        ]
    },

    // Not found
    { path: '**', redirectTo: 'home' }

];
