//
// Created by Michal Koudelka on 11.10.13.
// Copyright (c) 2013 Michal Koudelka. All rights reserved.
//
// To change the template use AppCode | Preferences | File Templates.
//


#import "MyWebSocket.h"

static const int httpLogLevel = HTTP_LOG_LEVEL_VERBOSE;

@implementation MyWebSocket

- (void)didReceiveMessage:(NSString *)msg
{
    NSLog(msg);
    HTTPLogTrace();
    //[self sendMessage:[NSString stringWithFormat:@"Counter:",counter] ];
    [self sendMessage:@"Ano"];
}

- (void)didOpen {
    HTTPLogTrace();
    //counter = [[NSNumber alloc] initWithInt:0];
    [super didOpen];

    NSLog(@"Welcome");
}

-(void)didClose {
    HTTPLogTrace();
    NSLog(@"Closed");
    [self sendMessage:@"Bye bye"];
    [super didClose];
}

-(id)initWithRequest:(HTTPMessage *)request socket:(GCDAsyncSocket *)socket {
    HTTPLogTrace2(@"Init");
    return [super initWithRequest:request socket:socket];
}

@end