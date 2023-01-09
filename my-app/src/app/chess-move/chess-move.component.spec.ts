import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChessMoveComponent } from './chess-move.component';

describe('ChessMoveComponent', () => {
  let component: ChessMoveComponent;
  let fixture: ComponentFixture<ChessMoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChessMoveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChessMoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
