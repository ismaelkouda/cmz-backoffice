import { Injectable } from "@angular/core";
import Pusher from "pusher-js";

@Injectable({
    providedIn: 'root',
}) export class PusherWebsocketService {

    pusher: any = "";
    channel: any;

    constructor() {
        this.pusher = new Pusher("24c80cd7e27e01851afb",
            {
                cluster: "eu",
                wsPort: 6001,
                wsHost: "http://10.10.0.15",
            });

        this.channel = this.pusher.subscribe('chan-alarme-status');
    }
}