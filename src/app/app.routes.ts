import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminComponent } from './components/admin/admin.component';
import { ManageCoursesComponent } from './components/manage-cources/manage-cources.component';
import { CourseComponent } from './components/course/course.component';
import { PaymentStatusComponent } from './components/payment-status/payment-status.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/auth/sign-in/sign-in.component').then(m => m.SignInComponent)
  },
  { path: 'payment-status', component: PaymentStatusComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'manage-courses', component: ManageCoursesComponent },
  { path: 'course/:id', component: CourseComponent },

];
