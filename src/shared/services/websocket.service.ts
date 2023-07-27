import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io } from "socket.io-client";


@Injectable({
    providedIn: 'root',
})
export class WebsocketService {

    public message$: BehaviorSubject<string> = new BehaviorSubject('');
    public socket: any;
    constructor() {

        // this.socket.on("connect", () => {
        //     console.log("succesful connection");
        // });
    }

    public initializeConnection() {
        this.socket = io('ws://10.10.0.15:6001', {
            key: '24c80cd7e27e01851afb'
        });
        this.socket.on("connect", () => {
            console.log("succesful connection");
        });
    }
    public sendDats(data) {
        // this.socket.emit('send_message', data);
    }
    public GetDatas = () => {
        this.socket.on('alarme-status', (message) => {
            this.message$.next(message);
        });
        return this.message$.asObservable();
    };
}

