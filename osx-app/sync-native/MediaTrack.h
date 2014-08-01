//
//  MediaTrack.h
//  sync-native
//
//  Created by Michal Koudelka on 08.02.14.
//  Copyright (c) 2014 Michal Koudelka. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface MediaTrack : NSObject {

    NSData *data;
    NSString *mime;
}

-(id)initWithData:(NSData*)mData andMime:(NSString*)mMime;
-(NSData *)getData;
-(NSString *)getMime;


@end
