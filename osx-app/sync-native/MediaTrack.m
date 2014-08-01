//
//  MediaTrack.m
//  sync-native
//
//  Created by Michal Koudelka on 08.02.14.
//  Copyright (c) 2014 Michal Koudelka. All rights reserved.
//

#import "MediaTrack.h"

@implementation MediaTrack

-(id) initWithData:(NSData *)mData andMime:(NSString *)mMime {
    self = [super init];
    mime = mMime;
    data = mData;
    return self;
}

-(NSString*) getMime {
    return mime;
}

-(NSData*) getData {
    return data;
}
@end
