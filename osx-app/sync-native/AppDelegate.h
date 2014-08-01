//
//  AppDelegate.h
//  sync-native
//
//  Created by Michal Koudelka on 08.10.13.
//  Copyright (c) 2013 Michal Koudelka. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "HTTPSyncServer.h"

@interface AppDelegate : NSObject <NSApplicationDelegate> {
    IBOutlet NSMenu *statusMenu;
    
    IBOutlet NSMenuItem *serverMenuItem;
    IBOutlet NSMenuItem *settingsMenuItem;
    IBOutlet NSMenuItem *exitMenuItem;
    
    IBOutlet NSWindow *settingsWindow;
    
    IBOutlet NSTextField *HTTPserverPortField;
    IBOutlet NSTextField *SocketServerPortField;
    IBOutlet NSTextField *serverPasswordField;
    
    NSStatusItem *statusItem;
    NSImage *menuIcon;
    NSImage *menuIconHighlight;
    HTTPSyncServer *syncServer;
}
- (IBAction) serverAction:(id)sender;
- (IBAction) serverRestart:(id)sender;

@end