import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ImgsSearchComponent } from './imgs-search/imgs-search.component';
import { HttpClientModule } from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FiltreImagesComponent } from './filtre-images/filtre-images.component';
import { FormsModule } from '@angular/forms';
import { Mongodb } from '../../node_modules/mongodb';

@NgModule({
  declarations: [
    AppComponent,
    ImgsSearchComponent,
    FiltreImagesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    InfiniteScrollModule,
    FormsModule
  ],
  providers: [FiltreImagesComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
