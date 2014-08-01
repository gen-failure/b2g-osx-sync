//
//  ContactsManager.h
//  sync-native
//
//  Created by Michal Koudelka on 09.10.13.
//  Copyright (c) 2013 Michal Koudelka. All rights reserved.
//

#import <AddressBook/AddressBook.h>
#import <AddressBook/ABMultiValue.h>

@interface ContactsManager : NSObject {

}
+(NSData*) getContactsList;
+(NSData*) getContactImage: (NSString*)uid;
+(NSMutableDictionary*) serializePersonContact: (ABPerson*)contact;
@end

