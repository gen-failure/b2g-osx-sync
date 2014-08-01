//
// Created by Michal Koudelka on 10.10.13.
// Copyright (c) 2013 Michal Koudelka. All rights reserved.
//
// To change the template use AppCode | Preferences | File Templates.
//


#import "MediaManager.h"


@implementation MediaManager

+(NSString *)getAudioMimeType:(NSString *)extension {
    NSDictionary *contentTypes = @{
        @"mp4" : @"audio/mp4",
        @"m4a" : @"audio/mp4",
        @"mp3" : @"audio/mpeg",
        @"wav" : @"audio/wav"
    };
    if ([[contentTypes objectForKey:extension] isKindOfClass:[NSString class]]) {
        return [contentTypes objectForKey:extension];
    } else {
        return NO;
    }
}

+(NSData *)getMusicTracksList {



    NSMutableArray *list = [[NSMutableArray alloc] init];

    iTunesApplication *itunes = [[SBApplication alloc] initWithBundleIdentifier:@"com.apple.iTunes"];

    NSMutableArray * tracks= [[[[[itunes sources] objectWithName:@"Library"] userPlaylists] objectWithName:@"Music"] fileTracks];

    for (iTunesFileTrack *t in tracks) {
        if ([[self getAudioMimeType:[[[[t location] absoluteURL] path] pathExtension]] isKindOfClass: [NSString class] ]) {

            NSMutableDictionary *track = [[NSMutableDictionary alloc] init];
            
            [track setObject:[t album] forKey:@"album"];
            [track setObject:[t name]  forKey:@"name"];
            [track setObject:[[NSNumber alloc] initWithDouble:[t duration]] forKey:@"duration"];
            [track setObject:[t persistentID] forKey:@"id"];
            [track setObject:[t genre] forKey:@"genre"];
            [track setObject:[t artist] forKey:@"artist"];
            [track setObject:[[NSNumber alloc] initWithInt:[t size]] forKey:@"size"];
            [track setObject:[t artist] forKey:@"artist"];
            [track setObject:[[NSNumber alloc] initWithInt:[[t artworks] count]] forKey:@"images"];
            [track setObject:[self getAudioMimeType:[[[[t location] absoluteURL] path] pathExtension]] forKey:@"type"];

            [list insertObject:track atIndex:0];
        }
    }

    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:list options:0 error:&error];
    return jsonData;
}

+(NSData *)getMusicAlbumCover:(NSString *)album {
    NSPredicate *p = [NSPredicate predicateWithFormat:@"album == %@",album];
    iTunesApplication *itunes = [[SBApplication alloc] initWithBundleIdentifier:@"com.apple.iTunes"];

    NSImage *img;

    NSMutableArray *tracks = [[[[[itunes sources] objectWithName:@"Library"] userPlaylists] objectWithName:@"Music"] fileTracks];
    [tracks filterUsingPredicate:p];
    for (iTunesFileTrack *track in tracks) {
        if ([[track artworks] count] > 0) {
            if ([[[[track artworks] objectAtIndex:0] data] isKindOfClass:[NSAppleEventDescriptor class]]) {
                NSData *data = [[[track artworks] objectAtIndex:0] rawData];
                img = [[NSImage alloc] initWithData:data];
            } else {
                img = [[[track artworks] objectAtIndex:0] data];
            }
            break;
        }
    }
    if (!img) {
        NSSize size = NSMakeSize(64,64);
        img = [[NSImage alloc] initWithSize:size];
    }
    return [ImageTools getJPEGThumb:img];
}

+(MediaTrack *)getRecord:(NSString *)type trackId:(NSString *)trackId {
    if ([type isEqualToString:@"music"]) {
        NSLog(@"Looking for track id %@",trackId);
        iTunesApplication *itunes = [[SBApplication alloc] initWithBundleIdentifier:@"com.apple.iTunes"];
        NSPredicate *p = [NSPredicate predicateWithFormat:@"persistentID == %@",trackId];
        
        NSMutableArray * tracks= [[[[[itunes sources] objectWithName:@"Library"] userPlaylists] objectWithName:@"Music"] fileTracks];

        [tracks filterUsingPredicate:p];

        
        for (iTunesFileTrack *track in tracks) {
            NSLog(@"I have the file location: %@",[track location]);
            NSData *data = [[NSData alloc] initWithContentsOfURL:[track location]];
            NSString *mime = [self getAudioMimeType:[[[[track location] absoluteURL] path] pathExtension]];
            MediaTrack *mTrack = [[MediaTrack alloc] initWithData:data andMime:mime];
            
            NSLog(@"Returning data!");
            return mTrack;
        }
    }
    NSLog(@"Returning false");
    return NO;
}
@end