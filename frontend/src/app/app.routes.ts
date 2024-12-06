import { Routes } from '@angular/router';
import { GameComponent } from '../game/game.component';
import { CreditsComponent } from './pages/credits/credits.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: 'home', loadChildren: () => import('./pages/home/home.routes').then(m => m.HOME_ROUTES) },
  { path: 'game', pathMatch: 'full', component: GameComponent },
  { path: 'credits', pathMatch: 'full', component: CreditsComponent }
];
