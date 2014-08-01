//
// Created by Michal Koudelka on 10.10.13.
// Copyright (c) 2013 Michal Koudelka. All rights reserved.
//
// To change the template use AppCode | Preferences | File Templates.
//


@interface ImageTools : NSObject
    +(NSString *)getContentType:(NSData *)data;
    +(NSData *)getJPEGThumb:(NSImage *)img;
@end