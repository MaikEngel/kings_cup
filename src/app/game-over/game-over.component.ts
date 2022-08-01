import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameComponent } from '../game/game.component';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss']
})
export class GameOverComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  refreshGame() {
    this.router.navigateByUrl('');
  }

}
