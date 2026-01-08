import { Routes } from '@angular/router';
import { SwitchDocComponent } from './pages/switch-doc/switch-doc.component';
import { SelectDocComponent } from './pages/select-doc/select-doc.component';

export const routes: Routes = [
  { path: '', redirectTo: 'switch', pathMatch: 'full' },
  { path: 'switch', component: SwitchDocComponent },
  { path: 'select', component: SelectDocComponent },
];
