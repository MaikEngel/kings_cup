import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collectionData, collection, setDoc, doc, getDoc, CollectionReference, updateDoc, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
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
  games$: Observable<any>;
  game: Game;
  gameId: string;
  currentGame: any;
  public gameData: any;

  constructor(private route: ActivatedRoute, public dialog: MatDialog, private firestore: Firestore, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (pm) => {
      const coll = collection(this.firestore, 'games');
      this.games$ = collectionData(coll);
      const gameID = pm.get('id');
      this.gameId = gameID;
      const docRef = doc(coll, this.gameId);
      const docSnap = await getDoc(docRef);
      this.currentGame = docSnap.data()['game'];
      this.gameData = docRef;
      if (docSnap.exists()) {
        this.newGame();
      } else {
        console.log("No such document!");
      }
    })
  }

  newGame() {
    this.game = this.currentGame;
    const unsub = onSnapshot(this.gameData, (doc) => {
      this.game = doc.data()['game'];
    });
  }

  pickCard() {

    if (!this.game.pickCardAnimation && this.game.players.length >= 2 && this.game.stack.length > 0) {
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.saveGame();

      setTimeout(() => {
        this.game.playedCard.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
        // this.realTimeUpdate()
      }, 1000);
    }
    if (this.game.players.length < 2) {
      alert('Create 2 player!')
    }
    if (this.game.stack.length == 0) {
      console.log(this.gameData.id);
      this.router.navigateByUrl('/gameover');
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

  refreshGame(){
  this.game = new Game();
  this.game = this.currentGame;
    const unsub = onSnapshot(this.gameData, (doc) => {
      this.game = doc.data()['game'];
    });
  this.saveGame();
  }
}


function id(id: any, string: any) {
  throw new Error('Function not implemented.');
}