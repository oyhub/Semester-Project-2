import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { RouterModule, Routes } from '@angular/router';


import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ButtonComponent } from './components/button/button.component';
import { DoubleButtonComponent } from './components/double-button/double-button.component';
import { FooterComponent } from './components/footer/footer.component';
import { ModalComponent } from './components/modal/modal.component';
import { InputComponent } from './components/inputs/input.component';
import {FormsModule} from "@angular/forms";
import { ListingsComponent } from './pages/listings/listings.component';
import { CardComponent } from './components/card/card.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CreateNewComponent } from './pages/create-new/create-new.component';
import { WineComponent } from './pages/wine/wine.component';

const routes: Routes = [
  { path: '', component: ListingsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'create-new', component: CreateNewComponent },
  { path: 'wine', component: WineComponent },
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
    WineComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
