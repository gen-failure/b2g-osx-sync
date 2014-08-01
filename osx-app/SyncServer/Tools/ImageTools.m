//
// Created by Michal Koudelka on 10.10.13.
// Copyright (c) 2013 Michal Koudelka. All rights reserved.
//
// To change the template use AppCode | Preferences | File Templates.
//


#import "ImageTools.h"


@implementation ImageTools
    + (NSString*) getContentType:(NSData *)data {
        uint8_t c;
        [data getBytes:&c length:1];

        switch (c) {
            case 0xFF:
                return @"image/jpeg";
            case 0x89:
                return @"image/png";
            case 0x47:
                return @"image/gif";
            case 0x49:
            case 0x4D:
                return @"image/tiff";
        }
        return @"image/unknown";
    }
    + (NSData*) getJPEGThumb:(NSImage *)img {

        int newWidth = 64;
        int newHeight = 64;

        if ([img size].width > [img size].height) {
             newWidth = 64;
             newHeight = 64 / ([img size].width / [img size].height);
        } else {
            newWidth = 64 / ([img size].height / [img size].width);
            newHeight = 64;
        }

        NSSize newSize = NSMakeSize(newWidth,newHeight);

        NSImage *newImage = [[NSImage alloc] initWithSize:newSize];
        [newImage lockFocus];

        NSRect rect;
        rect.origin = NSZeroPoint;
        rect.size.width = newSize.width;
        rect.size.height = newSize.height;

        [img drawInRect:rect fromRect:NSZeroRect operation:NSCompositeSourceOver fraction:1.0 respectFlipped:false hints:nil];

        [newImage unlockFocus];

        NSData *newImageData = [newImage TIFFRepresentation];
        NSBitmapImageRep *rep = [[NSBitmapImageRep alloc] initWithData:newImageData];

        NSData *outputData = [rep representationUsingType:NSJPEGFileType properties:nil];

        return outputData;
    }
@end