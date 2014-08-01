//
//  AppDelegate.m
//  sync-native
//
//  Created by Michal Koudelka on 08.10.13.
//  Copyright (c) 2013 Michal Koudelka. All rights reserved.
//

#import "AppDelegate.h"


@implementation AppDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)aNotification
{
    
    [[NSUserDefaults standardUserDefaults] registerDefaults:[NSDictionary dictionaryWithObject:[NSNumber numberWithInt:19090] forKey:@"HTTPserverPort"]];
    [[NSUserDefaults standardUserDefaults] registerDefaults:[NSDictionary dictionaryWithObject:[NSNumber numberWithInt:19091] forKey:@"SocketserverPort"]];

    [[NSUserDefaults standardUserDefaults] registerDefaults:[NSDictionary dictionaryWithObject:@"123456" forKey:@"serverPassword" ]];
    
    [HTTPserverPortField setIntegerValue:[[[NSUserDefaults standardUserDefaults] objectForKey:@"HTTPserverPort"] intValue]];
    [SocketServerPortField setIntegerValue:[[[NSUserDefaults standardUserDefaults] objectForKey:@"SocketserverPort"] intValue]];
    [serverPasswordField setStringValue:[[NSUserDefaults standardUserDefaults] objectForKey:@"serverPassword"]];
    
    statusItem = [[NSStatusBar systemStatusBar] statusItemWithLength:NSSquareStatusItemLength];
    [statusItem setMenu:statusMenu];
    [statusItem setImage:[NSImage imageNamed:@"icon"]];
    //[statusItem setHighlightMode:YES];

    syncServer = [[HTTPSyncServer alloc] init];
    int port = [[[NSUserDefaults standardUserDefaults] objectForKey:@"HTTPserverPort"] intValue];
    [syncServer setPort:port];
    [self startServer];

   /*NSAlert *alert = [[NSAlert alloc] init];
    [alert setMessageText:@"Hi there."];
    [alert runModal];
     */
}

- (void) startServer {

    [syncServer startServer];
}

- (IBAction)serverAction:(id)sender
{
    NSLog(@"Clicked to server action");
}

- (IBAction)settingsAction:(id)sender {
    [settingsWindow orderFront:self];
}
- (IBAction)serverRestart:(id)sender {
    NSLog(@"Clicked to server action");
}
@end

