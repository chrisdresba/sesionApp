import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { sesionGuard } from './shared/guards/sesion.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./paginas/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./paginas/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./paginas/home/home.module').then( m => m.HomePageModule),
    canActivate: [sesionGuard]
  },
  {
    path: 'validar-identidad',
    loadChildren: () => import('./paginas/datos/datos.module').then( m => m.DatosPageModule)
  },
  {
    path: 'detalle',
    loadChildren: () => import('./paginas/detalle/detalle.module').then( m => m.DetallePageModule)
  },
  {
    path: 'pedido-detalle/:id',
    loadChildren: () => import('./paginas/pedido-detalle/pedido-detalle.module').then( m => m.PedidoDetallePageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
