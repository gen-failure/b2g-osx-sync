//
//  TransferSocket.h
//  sync-native
//
//  Created by Michal Koudelka on 23.11.13.
//  Copyright (c) 2013 Michal Koudelka. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CocoaHTTPServer/WebSocket.h>

@interface TransferSocket : WebSocket
{
    NSData *transferData;
}
@end
