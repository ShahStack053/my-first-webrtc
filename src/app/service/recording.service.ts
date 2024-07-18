import { Injectable } from '@angular/core';
import { RTCLibService } from 'rtc-lib';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class RecordingService {
  socketUrl = 'http://localhost:3000'
  recording = false
  individualRecordingId: any
  localStream: any;
  individualMediaRecorder: any

  constructor(public rtcLibService: RTCLibService,
  ) { }

  startRecordingMeeting() {
    const socket = io(this.socketUrl, {
      transports: ['websocket'],
    })
    this.localStream = this.rtcLibService.localStream

    this.individualRecordingId = this.generateRecordingId()
    socket.emit('create-Individual-file', { roomId: this.localStream.room.roomID, recordingId: this.individualRecordingId })
    this.individualMediaRecorder = new MediaRecorder(this.localStream.stream);
    this.individualMediaRecorder.ondataavailable = (event: any) => {
      if (event.data.size > 0) {
        socket.emit('individual-stream', event.data);
      }
    };

    this.individualMediaRecorder.onstop = () => {
      socket.disconnect();
    };
    this.individualMediaRecorder.start(3000);
  }

  stopRecordingMeeting(endCall = false) {
    this.individualMediaRecorder.stop();
    const socket = io(this.socketUrl, {
      transports: ['websocket'],
    })
    socket.disconnect();

    // socket.emit('process-Individual-recording', { roomId: this.localStream.room.roomID, recordingId: this.individualRecordingId }, () => {
    //   socket.disconnect();
    // })
  }

  generateRecordingId() {
    const timestamp = new Date().getTime(); // Get current timestamp
    const randomNum = Math.floor(Math.random() * 1000000); // Generate a random number
    const recordingId = `${timestamp}_${randomNum}`; // Combine timestamp and random number

    return recordingId;
  }
}


