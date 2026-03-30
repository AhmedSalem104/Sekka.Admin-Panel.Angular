import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layout/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'drivers',
        loadComponent: () => import('./pages/drivers/drivers.component').then(m => m.DriversComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent)
      },
      {
        path: 'customers',
        loadComponent: () => import('./pages/customers/customers.component').then(m => m.CustomersComponent)
      },
      {
        path: 'partners',
        loadComponent: () => import('./pages/partners/partners.component').then(m => m.PartnersComponent)
      },
      {
        path: 'subscriptions',
        loadComponent: () => import('./pages/subscriptions/subscriptions.component').then(m => m.SubscriptionsComponent)
      },
      {
        path: 'settlements',
        loadComponent: () => import('./pages/settlements/settlements.component').then(m => m.SettlementsComponent)
      },
      {
        path: 'payments',
        loadComponent: () => import('./pages/payments/payments.component').then(m => m.PaymentsComponent)
      },
      {
        path: 'wallets',
        loadComponent: () => import('./pages/wallets/wallets.component').then(m => m.WalletsComponent)
      },
      {
        path: 'disputes',
        loadComponent: () => import('./pages/disputes/disputes.component').then(m => m.DisputesComponent)
      },
      {
        path: 'invoices',
        loadComponent: () => import('./pages/invoices/invoices.component').then(m => m.InvoicesComponent)
      },
      {
        path: 'refunds',
        loadComponent: () => import('./pages/refunds/refunds.component').then(m => m.RefundsComponent)
      },
      {
        path: 'statistics',
        loadComponent: () => import('./pages/statistics/statistics.component').then(m => m.StatisticsComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./pages/notifications/notifications.component').then(m => m.NotificationsComponent)
      },
      {
        path: 'sos',
        loadComponent: () => import('./pages/sos/sos.component').then(m => m.SosComponent)
      },
      {
        path: 'vehicles',
        loadComponent: () => import('./pages/vehicles/vehicles.component').then(m => m.VehiclesComponent)
      },
      {
        path: 'config',
        loadComponent: () => import('./pages/config/config.component').then(m => m.ConfigComponent)
      },
      {
        path: 'regions',
        loadComponent: () => import('./pages/regions/regions.component').then(m => m.RegionsComponent)
      },
      {
        path: 'roles',
        loadComponent: () => import('./pages/roles/roles.component').then(m => m.RolesComponent)
      },
      {
        path: 'blacklist',
        loadComponent: () => import('./pages/blacklist/blacklist.component').then(m => m.BlacklistComponent)
      },
      {
        path: 'audit-logs',
        loadComponent: () => import('./pages/audit-logs/audit-logs.component').then(m => m.AuditLogsComponent)
      },
      {
        path: 'segments',
        loadComponent: () => import('./pages/segments/segments.component').then(m => m.SegmentsComponent)
      },
      {
        path: 'campaigns',
        loadComponent: () => import('./pages/campaigns/campaigns.component').then(m => m.CampaignsComponent)
      },
      {
        path: 'insights',
        loadComponent: () => import('./pages/insights/insights.component').then(m => m.InsightsComponent)
      },
      {
        path: 'savings-circles',
        loadComponent: () => import('./pages/savings-circles/savings-circles.component').then(m => m.SavingsCirclesComponent)
      },
      {
        path: 'time-slots',
        loadComponent: () => import('./pages/time-slots/time-slots.component').then(m => m.TimeSlotsComponent)
      },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
