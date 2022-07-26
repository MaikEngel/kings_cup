import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, collectionData, collection, setDoc, doc } from '@angular/fire/firestore';
import { Game } from 'src/models/game';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {
  games$: Observable<any>;
  game: Game;

  constructor(private route: ActivatedRoute, private firestore: Firestore, private router: Router) {
    const coll = collection(firestore, 'games');
    this.games$ = collectionData(coll);

    this.games$.subscribe((newGames) => {
      this.game = newGames;
      this.route.params.subscribe((params) => {
        console.log('params', params);
      })
    })
   }


   
  ngOnInit(): void {

  }


  newGame() {
    let game = new Game();
    const coll = collection(this.firestore, 'games');
    setDoc(doc(coll), { game: game.toJson() }); 
    
  }

}
function then(arg0: () => void) {
  throw new Error('Function not implemented.');
}

