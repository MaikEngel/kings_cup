import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, collectionData, collection, setDoc, doc, getDoc, CollectionReference } from '@angular/fire/firestore';
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
    })
  }

  ngOnInit(): void {

  }

  newGame() {
    const coll = collection(this.firestore, 'games');
    this.route.params.subscribe(async () => {
      this.game = new Game();
      setDoc(doc(coll), { game: this.game.toJson() });
      const docColl = doc(coll).id;
      this.router.navigateByUrl('/game/' + docColl);
    })
  }

}
function then(arg0: () => void) {
  throw new Error('Function not implemented.');
}

