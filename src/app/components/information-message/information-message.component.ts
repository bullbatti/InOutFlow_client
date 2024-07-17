import { Component } from '@angular/core';

import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-information-message',
  standalone: true,
  imports: [ToastModule],
  templateUrl: './information-message.component.html',
  styleUrl: './information-message.component.css'
})
export class InformationMessageComponent {

}
