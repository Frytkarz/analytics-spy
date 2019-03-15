/* Modules */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxEchartsModule } from 'ngx-echarts';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

/* Entry */
import { AppComponent } from './app.component';

/* Custom modules */
import { AngularMaterialModule } from './modules/angular-material/angular-material.module';
import { RoutingModule } from './modules/routing/routing.module';

/* Pages */
import { MapComponent } from './pages/map/map.component';

/* Others */
import { environment } from '../environments/environment';

@NgModule({
    declarations: [
        AppComponent,
        MapComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        CommonModule,
        FormsModule,
        AngularMaterialModule,
        ReactiveFormsModule,
        RoutingModule,

        NgxEchartsModule,

        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
