//
//  HTTPSyncServer.m
//  sync-native
//
//  Created by Michal Koudelka on 09.10.13.
//  Copyright (c) 2013 Michal Koudelka. All rights reserved.
//

#import "HTTPSyncServer.h"
#import "HTTPSyncConnection.h"


@implementation HTTPSyncServer

-(id)init  {
    if (self = [super init]) {
        http = [[RoutingHTTPServer alloc] init];
        //[http setConnectionClass:[HTTPSyncConnection class]];
        [http setPort: [[[NSUserDefaults standardUserDefaults] objectForKey:@"HTTPServerPort"] intValue]];
        [self setupRoutes];
    }
    return self;
}

-(void)setupRoutes {
    [http handleMethod:@"GET" withPath:@"/contacts/list" block:^(RouteRequest *request, RouteResponse *response) {
        [response setHeader:@"Content-Type" value:@"text/json"];
        [response respondWithData:[ContactsManager getContactsList]];
    }];

    [http handleMethod:@"GET" withPath:@"/contacts/image/:uid" block:^(RouteRequest *request, RouteResponse *response) {
        NSData *imageData = [ContactsManager getContactImage:[request param:@"uid"]];
        [response setHeader:@"Content-Type" value:[ImageTools getContentType:imageData]];
        [response respondWithData:imageData];
    }];
    [http handleMethod:@"GET" withPath:@"/media/music/list" block:^(RouteRequest *request, RouteResponse *response) {
        NSData *tracks = [MediaManager getMusicTracksList];
        [response setHeader:@"Content-Type" value:@"text/json"];
        [response respondWithData:tracks];
    }];
    [http handleMethod:@"GET" withPath:@"/media/music/album/image/:album" block:^(RouteRequest *request, RouteResponse *response) {
        NSData *encHash = [NSData dataFromBase64String:[request param:@"album"]];
        NSString *encName = [[NSString alloc] initWithData:encHash encoding:NSASCIIStringEncoding];
        NSString *albumName = [encName stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];

        NSData *cover = [MediaManager getMusicAlbumCover: albumName];
        [response setHeader:@"Content-Type" value:@"image/jpeg"];
        [response respondWithData: cover];
    }];
    
    [http handleMethod:@"GET" withPath:@"/media/music/track/:uid" block:^(RouteRequest *request, RouteResponse *response) {
        MediaTrack *record = [MediaManager getRecord:@"music" trackId:[request param:@"uid"]];
        if (!record) {
            [response setStatusCode:404];
            [response respondWithString:@"Unknown track"];
        } else {
            NSLog(@"Returning file");
            [response setHeader:@"Content-Type" value:[record getMime]];
            [response respondWithData:[record getData]];
        }
    }];
}
-(void)startServer {
    NSLog(@"Starting");
    NSError *error;
    if (![http start:&error]) {
        NSLog(@"Error starting HTTP server: %@", error);
    }
}

-(void)setPort:(int)p {
    [http setPort:p];
}
-(BOOL)isRunning {
    return [http isRunning];
}
@end
