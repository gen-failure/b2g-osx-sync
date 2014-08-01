//
// Created by Michal Koudelka on 11.10.13.
// Copyright (c) 2013 Michal Koudelka. All rights reserved.
//
// To change the template use AppCode | Preferences | File Templates.
//


#import <Foundation/Foundation.h>
#import <CocoaHTTPServer/HTTPServer.h>
#import "HTTPSyncServer.h"

@interface SyncServer : NSObject {
    HTTPSyncServer *http;
}

-(void) init;
-(void) start;
-(void) stop;
@end