import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collectionData, collection, setDoc, doc, getDoc, CollectionReference, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { User } from '@angular/fire/auth';
import { get } from '@angular/fire/database';
import { update } from '@firebase/database';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';
  games$: Observable<any>;
  game: Game;
  gameId: string;
  currentGame: any;

  constructor(private route: ActivatedRoute, public dialog: MatDialog, private firestore: Firestore,) { }

  ngOnInit(): void {
    const coll = collection(this.firestore, 'games');
    this.games$ = collectionData(coll);
    this.route.paramMap.subscribe(async (pm) => {
      const gameID = pm.get('id');
      this.gameId = gameID;
      const docRef = doc(coll, this.gameId);


      const docSnap = await getDoc(docRef);
      this.currentGame = docSnap.data()['game'];
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data()['game']);
        this.newGame();
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
  }


  newGame() {
    this.game = this.currentGame;
  }

  pickCard() {
    if (!this.pickCardAnimation && this.game.players.length >= 2) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;

      setTimeout(() => {
        this.game.playedCard.push(this.currentCard);
        this.pickCardAnimation = false;
        this.saveGame();
      }, 1000);
    }
    else {
      alert('Create 2 player!')
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent, {

    });

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame()
      }
    });
  }

  async saveGame() {
    const coll = collection(this.firestore, 'games');
    const docRef = doc(coll, this.gameId);
    await setDoc(docRef, { game: this.game });
  }
}
function id(id: any, string: any) {
  throw new Error('Function not implemented.');
}