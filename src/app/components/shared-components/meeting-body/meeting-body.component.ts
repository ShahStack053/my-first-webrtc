import { Component, HostListener } from '@angular/core';
import {
  IRespRoom,
  RoomSpecReq,
  RTCLibService,
  StreamSpec,
  TokenSpec,
} from 'rtc-lib';
import { ActivatedRoute, Router } from '@angular/router';
import initLayoutContainer from 'opentok-layout-js';


@Component({
  selector: 'app-meeting-body',
  templateUrl: './meeting-body.component.html',
  styleUrls: ['./meeting-body.component.scss']
})

export class MeetingBodyComponent {
  audioFlag = true;
  videoFlag = false;
  layout: any;
  remote: any;
  roomId: any;
  roomSpec: RoomSpecReq = { name: 'shmookh', p2p: true, type: 'conference' };
  room: IRespRoom | undefined;
  tokenSpec: TokenSpec = { roomId: '', username: 'shmookh' };
  streamSpec: StreamSpec = {
    audio: true,
    video: true,
    screen: false,
    data: true,
    attributes: { username: 'saad', type: 'call' },
  };

  ngOnInit(): void {
    this.getRoomId();
    this.streamSubscribeEventHandler()
  }

  ngAfterViewInit() {
    this.container();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.layout.layout();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event) {
    this.rtcLibService.closeStream();
    this.rtcLibService.leaveRoom(this.rtcLibService.room);
  }

  constructor(private rtcLibService: RTCLibService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.remote = this.rtcLibService.remoteCalls;

  }

  container(): void {
    const options = {
      maxRatio: 3 / 2,             // The narrowest ratio that will be used (default 2x3)
      minRatio: 9 / 16,            // The widest ratio that will be used (default 16x9)
      fixedRatio: false,         // If this is true then the aspect ratio of the video is maintained and minRatio and maxRatio are ignored (default false)
      scaleLastRow: true,        // If there are less elements on the last row then we can scale them up to take up more space
      alignItems: 'center',      // Can be 'start', 'center' or 'end'. Determines where to place items when on a row or column that is not full
      bigClass: "OT_big",        // The class to add to elements that should be sized bigger
      bigPercentage: 0.8,        // The maximum percentage of space the big ones should take up
      minBigPercentage: 0,       // If this is set then it will scale down the big space if there is left over whitespace down to this minimum size
      bigFixedRatio: false,      // fixedRatio for the big ones
      bigScaleLastRow: true,     // scale last row for the big elements
      bigAlignItems: 'center',   // How to align the big items
      smallAlignItems: 'center', // How to align the small row or column of items if there is a big one
      maxWidth: Infinity,        // The maximum width of the elements
      maxHeight: Infinity,       // The maximum height of the elements
      smallMaxWidth: Infinity,   // The maximum width of the small elements
      smallMaxHeight: Infinity,  // The maximum height of the small elements
      bigMaxWidth: Infinity,     // The maximum width of the big elements
      bigMaxHeight: Infinity,    // The maximum height of the big elements
      bigMaxRatio: 3 / 2,          // The narrowest ratio to use for the big elements (default 2x3)
      bigMinRatio: 9 / 16,         // The widest ratio to use for the big elements (default 16x9)
      bigFirst: true,            // Whether to place the big one in the top left (true) or bottom right (false).
      // You can also pass 'column' or 'row' to change whether big is first when you are in a row (bottom) or a column (right) layout
      animate: true,             // Whether you want to animate the transitions using jQuery (not recommended, use CSS transitions instead)
      window: window,            // Lets you pass in your own window object which should be the same window that the element is in
      ignoreClass: 'OT_ignore',  // Elements with this class will be ignored and not positioned. This lets you do things like picture-in-picture
      onLayout: null,            // A function that gets called every time an element is moved or resized, (element, { left, top, width, height }) => {}
    };
    // @ts-ignore
    this.layout = initLayoutContainer(document.getElementById("video-call"), options);
    this.layout.layout();
  }

  getRoomId(): void {
    this.activatedRoute.params.subscribe((params) => {
      console.log('params', params);
      if (params['id']) {
        this.roomId = params['id'];
        console.log('roomID', this.roomId)
        this.activatedRoute.queryParams.subscribe((params) => {
          const name = params['name'];
          console.log('Name:', name);
          const data = { sessionType: 'conference' };
          this.tokenSpec.roomId = this.roomId;
          this.tokenSpec.username = name;
          this.streamSpec.attributes.username = name;
          console.log('before join call', name)
          this.rtcLibService.call(this.tokenSpec, this.streamSpec, "AG.ITfJdZFMkAtPQybHxVBqpL1zeGa0u7h3");
        })
      }
    })
  }

  toggleBigClass(elem: any) {
    if (elem.classList.contains('OT_big')) {
      elem.classList.remove('OT_big');
    } else {
      elem.classList.add('OT_big');
    }
    this.layout.layout();
  }

  streamSubscribeEventHandler() {
    this.rtcLibService.event.subscribe({
      next: (event: any) => {
        let { type } = event;
        switch (type) {
          case 'layouting':
            console.log("[Layouting][APP]:")
            let count = 0;
            const maxRuns = 3;
            const intervalId = setInterval(() => {
              if (count < maxRuns) {
                this.layout.layout();
                count++;
              } else {
                clearInterval(intervalId); // Stop the interval after three runs
              }
            }, 1000);
            break;
          default:
            break;
        }
      }
    });
  }

  endCall() {
    this.rtcLibService.closeStream();
    this.rtcLibService.leaveRoom(this.rtcLibService.room);
    this.router.navigate([''])
  }

  async toggleLocalAudio() {
    this.audioFlag = !this.audioFlag;
    this.rtcLibService.setAudio(this.audioFlag);
  }
  async toggleLocalVideo() {
    this.videoFlag = !this.videoFlag;
    this.rtcLibService.setVideo(this.videoFlag);
  }
}

