import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { RegistrationComponent } from './component/registration/registration.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MarksComponent} from './marks/marks.component';
import { HomeComponent } from './home/home.component';
import {StudentService} from './student.service';
import { HttpClientModule } from '@angular/common/http';



const routes: Routes = [
  { path: 'Login', component: LoginComponent},
  { path: 'Registration', component:RegistrationComponent },
  { path: 'Navbar', component:NavbarComponent },
  { path: 'Marks',component:MarksComponent},
  { path:'Home',component:HomeComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    NavbarComponent,
    FooterComponent,
    MarksComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    NgbModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule
  ],
  providers: [
    StudentService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
