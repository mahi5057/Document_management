import { NgModule, Inject, PLATFORM_ID } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { isPlatformBrowser } from '@angular/common';
import { SocketBrowserModule } from './socket.browser.module';
import { SocketServerModule } from './socket.server.module';

@NgModule({
    imports: [
    ],
    providers: [
        {
            provide: 'SocketModule',
            useFactory: (platformId: Object) =>
                isPlatformBrowser(platformId) ? SocketBrowserModule : [],
            deps: [PLATFORM_ID],
        },
    ],
    exports: [SocketIoModule],
})
export class SocketModule {
    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        if (isPlatformBrowser(this.platformId)) {
            console.log('SocketModule initialized for the browser.');
        } else {
            console.log('SocketIoModule skipped for the server.');
        }
    }
}
