import { Component } from '@angular/core';
import { WebSocketService } from 'src/app/services/web-socket.service';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})


export class InicioComponent {
  posicionX:string="";
  posicionY:string="";

  constructor(private webSocket:WebSocketService){


  }
  ngoninit(){

  }
  public updatePosicion(valor: any) {

      this.posicionX=valor[0];
      this.posicionY=valor[1];
      this.webSocket.sendMessage(this.posicionX,this.posicionY )
  }
}
