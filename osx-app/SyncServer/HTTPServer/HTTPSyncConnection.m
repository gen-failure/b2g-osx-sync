//
// Created by Michal Koudelka on 10.10.13.
// Copyright (c) 2013 Michal Koudelka. All rights reserved.
//
// To change the template use AppCode | Preferences | File Templates.
//

#import "HTTPSyncConnection.h"

static const int httpLogLevel = HTTP_LOG_LEVEL_VERBOSE;

@implementation HTTPSyncConnection

- (NSObject<HTTPResponse> *)httpResponseForMethod:(NSString *)method URI:(NSString *)path {
    if ([path isEqualToString:@"/contacts/list"]) {
        contentType = @"text/json";
        HTTPDataResponse *response = [[HTTPDataResponse alloc] initWithData:[ContactsManager getContactsList]];
        return response;
    } else if ([path isEqualToString:@"/media/music/list"]) {
        HTTPDataResponse *response = [[HTTPDataResponse alloc] initWithData:[MediaManager getMusicTracksList]];
        contentType = @"text/json";
        return response;
    } else if ([path hasPrefix:@"/contacts/image/"]) {
        contentType = @"image/jpeg";
        NSString *pattern = @"([A-Z0-9\\-]+:ABPerson)";
        NSRegularExpression* regex = [NSRegularExpression regularExpressionWithPattern: pattern options:0 error:NULL];
        NSTextCheckingResult *newSearchString = [regex firstMatchInString:path options:0 range:NSMakeRange(0, [path length])];
        NSString *contactId = [path substringWithRange:newSearchString.range];
        HTTPDataResponse *response = [[HTTPDataResponse alloc] initWithData:[ContactsManager getContactImage:contactId]];
        return response;
        
    } else if ([path hasPrefix:@"/media/music/album/image"]) {
        contentType = @"image/jpeg";
        NSRegularExpression *regex = [NSRegularExpression
                                      regularExpressionWithPattern:@"/media/music/album/image/([A-Z0-9]+={0,2})/{0,1}$"
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
    return [super httpResponseForMethod:method URI:path];
}
-(NSDictionary *) httpHeaders {
    if ([contentType length] > 0) {
        contentType = @"binary/octet-stream";
    }
    return [NSDictionary dictionaryWithObject:@"text/json" forKey:@"Content-Type"];
}
@end