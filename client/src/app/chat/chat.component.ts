import { Component, OnInit } from '@angular/core';
import { ChatService } from '../service/chat.service';
import { AuthService } from '../service/auth.service';
import { User } from '../service/user.interface';

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
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((res) => {
      this.currentUser = res;
    });
    this.chatService.getNewMessage().subscribe((mes) => {
      this.messageList.push(mes);
    });
  }

  sendMessage() {
    this.chatService.sendMessage(this.newMessage);
    this.newMessage = '';
  }
}
