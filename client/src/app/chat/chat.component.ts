import { Component, NgZone, OnInit } from '@angular/core';
import { ChatService } from '../service/chat.service';
import { AuthService } from '../service/auth.service';
import { User } from '../service/user.interface';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  newMessage = '';
  messageList: string[] = [];
  currentUser: User | null;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<ChatComponent>,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((res) => {
      this.currentUser = res;
    });
    this.chatService.getNewMessage().subscribe((mes) => {
      if (mes !== '') {
        this.messageList.push(mes);
      }
    });
    console.log(this.messageList);
  }

  sendMessage() {
    this.chatService.sendMessage(this.newMessage);
    this.newMessage = '';
  }

  closeDialog() {}
}
