//
//  AppController.h
//  sync-native
//
//  Created by Michal Koudelka on 08.10.13.
//  Copyright (c) 2013 Michal Koudelka. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface AppController : NSObject {
    NSWindow * window;
    IBOutlet NSMenu *statusMenu;
    NSStatusItem *statuItem;
}
@property (assign) IBOutlet NSWindow *window;

@end
