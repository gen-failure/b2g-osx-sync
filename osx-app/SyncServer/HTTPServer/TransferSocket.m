//
//  TransferSocket.m
//  sync-native
//
//  Created by Michal Koudelka on 23.11.13.
//  Copyright (c) 2013 Michal Koudelka. All rights reserved.
//

#import "TransferSocket.h"
#import <CocoaHTTPServer/HTTPLogging.h>

static const int httpLogLevel = HTTP_LOG_LEVEL_WARN | HTTP_LOG_FLAG_TRACE;

@implementation TransferSocket
- (void)didOpen {
    HTTPLogTrace2(@"Connection opened");
    [super didOpen];
}

- (void)didReceiveMessage:(NSString *)msg {
    NSLog(msg);
    if ([msg hasPrefix:@"get"]) {
        NSArray *args = [msg componentsSeparatedByString:@" "];
        if ([args[1] isEqual:@"music"]) {
            NSLog(@"I am supposed to download audio track with id %@", args[2]);
            [self sendMessage:@"OK"];
        }
    }
/*        NSRegularExpression *regex = [NSRegularExpression
                                      regularExpressionWithPattern:@"transfer ([a-z]+) ([a-z0-9]+)$"
                                      options:NSRegularExpressionCaseInsensitive
                                      error:NULL];
        
        NSTextCheckingResult *match = [regex firstMatchInString:path options:0 range:NSMakeRange(0, [path length])];
        if (match) {
            NSString *b64name = [path substringWithRange:[match rangeAtIndex:1]];
            NSData *encHash = [NSData dataFromBase64String:b64name];
            NSString *encName = [[NSString alloc] initWithData:encHash encoding:NSASCIIStringEncoding];
            NSString *albumName = [encName stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
            HTTPDataResponse *response = [[HTTPDataResponse alloc] initWithData:[MediaManager getMusicAlbumCover:albumName]];
            return response;
        }
 
    }
    HTTPLogTrace2(@"%@[%p]: didReceiveMessage: %@", THIS_FILE, self, msg);
    [self sendMessage:[NSString stringWithFormat:@"%d", 1]];
*/
}

//- (void)didClose {
//    HTTPLogTrace();
//    [super didClose];
//}

@end
