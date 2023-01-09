import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MoveEvaluation } from '../engine/MoveEvaluation';

@Component({
  selector: 'app-chess-move',
  templateUrl: './chess-move.component.html',
  styleUrls: ['./chess-move.component.scss']
})
export class ChessMoveComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() moveEvaluation!: MoveEvaluation;
  @Output() selectedMove = new EventEmitter<MoveEvaluation>();

  public makeMove() {
    this.selectedMove.emit(this.moveEvaluation);
  }

}
