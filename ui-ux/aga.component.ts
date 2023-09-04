import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {CrudService} from '@lib/services/crud.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Query} from '@lib/models/query';
import {AngularFireFunctions} from '@angular/fire/compat/functions';
import {EVENTS_CONTENT} from '@lib/constants/events';
import {Observable} from 'rxjs';
import {FADE_IN} from '@lib/animations/fade';
import {SLIDE_OUT} from '@lib/animations/slide';
import {FADE_OUT} from '@lib/animations/fade-out';
import {SLIDE_DOWN} from '@lib/animations/slide-down';

export interface Chat {
  who: AgaPlayers
  text: string;
  timestamp: number;
}
export enum AgaPlayers {
  Aga,
  User
}

export const AGA_PLAYERS: string[] = ["Aga", "User"];

@Component({
  selector: 'app-aga',
  templateUrl: './aga.component.html',
  styleUrls: ['./aga.component.scss'],
  animations: [FADE_IN, SLIDE_OUT, FADE_OUT, SLIDE_DOWN]
})
export class AgaComponent implements OnInit{
  chatControl = new FormControl('', [ Validators.required ]);
  clicked = false;
  stream!: Observable<any[]>;
  agaPlayers = AGA_PLAYERS;
  query: Query = {
    path: 'aga-chats',
    limit: 8,
    where: {field: 'timestamp', operator: '!=', value: ''},
    orderBy: {field: 'timestamp', direction: 'desc'}
  };

  constructor(
    private crud: CrudService,
    private snackbar: MatSnackBar,
    private functions: AngularFireFunctions,
  ) {}

  ngOnInit(): void {
    this.reset();
    this.stream = this.crud.colRefQueryValues(this.query);
  }
  reset(): void {
    this.chatControl.setValue('');
    this.clicked = false;
  }

  send(): void {
    this.clicked = true;
    if (!this.chatControl.value) {
      this.snackbar.open('Dude, Say Something!', 'X', {duration: 3000});
    } else {
      this.crud.add('aga-chats', {
        who: AgaPlayers.User,
        text: this.chatControl.value,
        timestamp: Date.now(),
      }).then(_ => {
        this.functions.httpsCallable('inspections')
          .call('inspections', {sentence: this.chatControl.value})
          .subscribe({
            next: response => {
              console.log("Evaluated as:", response);
              this.clicked = false;
            }
          });
        this.reset();
      }).catch(error => {
        this.snackbar.open(error.message, 'X', {duration: 7000});
        this.reset();
      })
    }
  }

  howLongAgo(seconds: number): string {
    const delta = Math.floor((new Date().getTime() - seconds) / 1000);
    let when = '';
    when = delta < 10 ? 'just now' :
      (delta >= 10 && delta < 60) ? delta + 's ago' :
        (delta >= 60 && delta < 3600) ? Math.floor((delta / 60)) + 'm ago' :
          Math.floor((delta / 3600)) + 'h ago';
    return when;
  }

}
