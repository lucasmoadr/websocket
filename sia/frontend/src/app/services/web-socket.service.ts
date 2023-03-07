import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  public userName = '';
  public groupName = '';
  public xToSend = '';
  public yToSend = '';
  public coordenadasToSend = '';
  public joined = false;
  public coordenadas: coordenadasControl[] = [{
    idProceso:"",
    x: "",
    y: "",
    GroupName:""
  }];

  public connection: HubConnection;
  constructor() {

    this.connection = new HubConnectionBuilder()
    .withUrl('https://localhost:44388/Hubs/Message',{skipNegotiation:true, transport:signalR.HttpTransportType.WebSockets})
    .build();

    //this.connectionstart();

  }
public connectionstart()
{
  this.connection.start()
  .then(_ => {
    console.log('Connection Started');
  }).catch(error => {
    return console.error(error);
  });

  this.connection.on("NewCoordenadas", message => this.newCoordenadas(message));
  this.connection.on("NewMessage", message => this.newCoordenadas(message));
  this.join();
}
  public sendMessage(coordenadaX:string, coordenadaY:string ) {
    if(this.connection.state!='Connected')
    {
      this.connectionstart();
    }
    const newCoordenadasControl: coordenadasControl = {
      idProceso:"",
      x: coordenadaX,
      y: coordenadaY,
      GroupName:""
    };

    this.connection.invoke('SendMessage', this.coordenadas[0].idProceso, coordenadaX, coordenadaY)
      .then( _ => this.coordenadasToSend = '');
  }
  private newUser(message: string) {
    console.log(message);
    this.coordenadas.push({
      idProceso:"",
    x: "",
    y: "",
    GroupName:""
    });
  }
 public join() {

        this.connection.invoke('JoinGroup', this.groupName, this.userName)
      .then(_ => {
        this.joined = true;
      });
  }
  public leave() {
    this.connection.invoke('LeaveGroup', this.groupName, this.userName)
      .then(_ => this.joined = false);
  }

/*   public leave() {
    this.connection.invoke('LeaveGroup', this.groupName, this.userName)
      .then(_ => this.joined = false);
  } */
  private newCoordenadas(coordenadas:coordenadasControl) {
    this.coordenadas=[];
    this.coordenadas.push(coordenadas);
  }
}
interface coordenadasControl {
  idProceso:string;
  x: string;
  y: string;
  GroupName?: string;
}
