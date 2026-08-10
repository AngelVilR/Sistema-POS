import { Component, computed, signal } from '@angular/core';
import { AuthenticationService } from './share/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('app');  

  constructor(private authService: AuthenticationService) {}
  
  public isLogued=computed(()=>{
    const user=this.authService.currentUserSignal()
    console.log('User: ',user?.role.toString())
    return (user?.role.toString() =='ADMIN') || (user?.role.toString() =='USER')
  })
}
