import { Routes } from '@angular/router';
import { SwitchDocComponent } from './pages/switch-doc/switch-doc.component';

export const routes: Routes = [
  { path: '', redirectTo: 'switch', pathMatch: 'full' },
  { path: 'switch', component: SwitchDocComponent }
];
