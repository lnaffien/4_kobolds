import { Routes } from '@angular/router';
import { GameComponent } from '../game/game.component'; // Correct path for the GameComponent

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES) },
  { path: 'game', pathMatch: 'full', component: GameComponent }
];
