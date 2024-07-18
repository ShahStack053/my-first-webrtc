import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RTCConfig, RtcLibModule, RTCLibService } from 'rtc-lib';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { MeetingBodyComponent } from './components/shared-components/meeting-body/meeting-body.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

const rtcConfig: RTCConfig = {
  AppID: '1',
  url: 'https://video.altegon.com',
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MeetingBodyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RtcLibModule.forRoot(rtcConfig),
    MatIconModule,
    MatTooltipModule
  ],
  providers: [RTCLibService],
  bootstrap: [AppComponent]
})
export class AppModule { }
