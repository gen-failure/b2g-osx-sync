//
//  HTTPSyncServer.h
//  sync-native
//
//  Created by Michal Koudelka on 09.10.13.
//  Copyright (c) 2013 Michal Koudelka. All rights reserved.
//

#import <RoutingHTTPServer/RoutingHTTPServer.h>

#import "ContactsManager.h"
#import "MediaTrack.h"

@interface HTTPSyncServer : NSObject {
    RoutingHTTPServer *http;
}

-(void) startServer;
-(void) setupRoutes;
-(void) setPort: (int)port;
-(BOOL) isRunning;
@end
