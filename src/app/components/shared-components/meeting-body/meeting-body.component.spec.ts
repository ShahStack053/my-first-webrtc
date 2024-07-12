import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingBodyComponent } from './meeting-body.component';

describe('MeetingBodyComponent', () => {
  let component: MeetingBodyComponent;
  let fixture: ComponentFixture<MeetingBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeetingBodyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetingBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
