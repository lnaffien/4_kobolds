import { Routes } from '@angular/router';
import { GameComponent } from '../game/game.component';
import { PodcastsComponent } from './pages/podcasts/podcasts.component';
import { CreditsComponent } from './pages/credits/credits.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES) },
  { path: 'game', pathMatch: 'full', component: GameComponent },
  { path: 'podcasts', pathMatch: 'full', component: PodcastsComponent },
  { path: 'credits', pathMatch: 'full', component: CreditsComponent }
];
