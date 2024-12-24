import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const browserConfig: SocketIoConfig = { url: 'http://localhost:3000', options: { autoConnect: true } };

@NgModule({
    imports: [SocketIoModule.forRoot(browserConfig)],
    exports: [SocketIoModule],
})
export class SocketBrowserModule {
    constructor() {
        console.log('SocketBrowserModule initialized for the browser.');
    }
}
