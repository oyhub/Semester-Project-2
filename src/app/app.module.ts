import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ButtonComponent } from './components/button/button.component';
import { DoubleButtonComponent } from './components/double-button/double-button.component';
import { FooterComponent } from './components/footer/footer.component';
import { ModalComponent } from './components/modal/modal.component';
import { InputComponent } from './components/inputs/input.component';
import { ListingsComponent } from './pages/listings/listings.component';
import { CardComponent } from './components/card/card.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CreateNewComponent } from './pages/create-new/create-new.component';
import { ListingComponent } from './pages/listing/listing.component';
import { AuthGuard } from "./guards/auth.guard";

const routes: Routes = [
  {
    path: '',
    component: ListingsComponent
  },{
    path: 'listing/:id',
    component: ListingComponent,
    canActivate: [AuthGuard],
    canLoad: [AuthGuard]
  },{
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    canLoad: [AuthGuard]

  },{
    path: 'create-new',
    component: CreateNewComponent,
    canActivate: [AuthGuard],
    canLoad: [AuthGuard]
  },{
    path: '**',
    redirectTo: '/'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavigationComponent,
    ButtonComponent,
    DoubleButtonComponent,
    FooterComponent,
    ModalComponent,
    InputComponent,
    ListingsComponent,
    CardComponent,
    ProfileComponent,
    CreateNewComponent,
    ListingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule
  ],
  exports: [RouterModule],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
