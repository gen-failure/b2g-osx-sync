//
// Created by Michal Koudelka on 10.10.13.
// Copyright (c) 2013 Michal Koudelka. All rights reserved.
//
// To change the template use AppCode | Preferences | File Templates.
//

#import <ScriptingBridge/ScriptingBridge.h>
#import "iTunes.h"
#import "ImageTools.h"
#import "MediaTrack.h"
#import "NSData+Base64.h"

@interface MediaManager : NSObject
+(NSData *) getMusicTracksList;
+(NSString *) getAudioMimeType:(NSString *)extension;
+(NSData *) getMusicAlbumCover:(NSString *)album;
+(MediaTrack *) getRecord:(NSString *)type trackId:(NSString *)trackId;
@end