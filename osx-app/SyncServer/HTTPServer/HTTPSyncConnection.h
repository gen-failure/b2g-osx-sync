//
// Created by Michal Koudelka on 10.10.13.
// Copyright (c) 2013 Michal Koudelka. All rights reserved.
//
// To change the template use AppCode | Preferences | File Templates.
//

#import <CocoaHTTPServer/HTTPConnection.h>
#import <CocoaHTTPServer/HTTPLogging.h>
#import <CocoaHTTPServer/HTTPDataResponse.h>

#import "ContactsManager.h"
#import "MediaManager.h"
#import "ImageTools.h"

#import "NSData+Base64.h"

@interface HTTPSyncConnection : HTTPConnection {
    NSString *contentType;
}
@end