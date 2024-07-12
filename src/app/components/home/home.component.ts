import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IRespRoom,
  RoomSpecReq,
  RTCLibService,
  StreamSpec,
  TokenSpec,
} from 'rtc-lib';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent {


  constructor(
    private router: Router,
    private http: HttpClient,
    private rtcLibService: RTCLibService) {
  }


  roomSpec: RoomSpecReq = { name: 'raza', p2p: true };
  room: IRespRoom | undefined;
  tokenSpec: TokenSpec = { roomId: '', username: 'shah' };
  streamSpec: StreamSpec = {
    audio: true,
    video: true,
    screen: false,
    data: true,
    attributes: { username: 'raza', type: 'call' },
  };


  createRoom(): void {
    this.rtcLibService.createRoom(this.roomSpec, 'AG.ITfJdZFMkAtPQybHxVBqpL1zeGa0u7h3').subscribe({
      next: (room: any) => {
        this.room = room.data;
        console.log('created room data:', this.room)
        this.tokenSpec.roomId = room.data.id
        this.tokenSpec.username = room.data.name
        this.streamSpec.attributes.username = room.data.name
        this.router.navigate(['/meeting-body', this.tokenSpec.roomId], {
          queryParams: { name: this.tokenSpec.username },
        });
      },
      error: (error: any) => {
        console.log('error in subscribing', { error });
      },
    });
  }

  createCall(): void {
    // this.rtcLibService.call(tokenSpec, StreamSpec)
  }
}
