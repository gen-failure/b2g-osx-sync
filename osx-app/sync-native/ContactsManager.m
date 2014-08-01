//
//  ContactsManager.m
//  sync-native
//
//  Created by Michal Koudelka on 09.10.13.
//  Copyright (c) 2013 Michal Koudelka. All rights reserved.
//

#import "ContactsManager.h"

@implementation ContactsManager
+ (NSData*) getContactsList {
    NSLog(@"Getting contact list");
    NSMutableDictionary *contacts = [[NSMutableDictionary alloc] init];

    for (ABPerson *person in [[ABAddressBook sharedAddressBook] people]) {
        [contacts setObject:[self serializePersonContact:person] forKey:[person valueForProperty:@"UID"]];
    }
    
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:contacts options:0 error:&error];
        
    return jsonData;
}

+ (NSMutableDictionary*) serializePersonContact:(ABPerson*)contact {
    NSMutableDictionary *hash = [[NSMutableDictionary alloc] init];
    NSMutableDictionary *hashData = [[NSMutableDictionary alloc] init];

    [hashData setObject:[[NSMutableArray alloc] init] forKey:@"givenName"];
    [hashData setObject:[[NSMutableArray alloc] init] forKey:@"additionalName"];
    [hashData setObject:[[NSMutableArray alloc] init] forKey:@"familyName"];
    [hashData setObject:[[NSMutableArray alloc] init] forKey:@"nickname"];
    [hashData setObject:[[NSMutableArray alloc] init] forKey:@"honorificPrefix"];
    [hashData setObject:[[NSMutableArray alloc] init] forKey:@"honorificSuffix"];
    [hashData setObject:[[NSMutableArray alloc] init] forKey:@"jobTitle"];
    [hashData setObject:[[NSMutableArray alloc] init] forKey:@"note"];
    [hashData setObject:[[NSMutableArray alloc] init] forKey:@"org"];
    [hashData setObject:[[NSMutableArray alloc] init] forKey:@"emails"];
    [hashData setObject:[[NSMutableArray alloc] init] forKey:@"tel"];
    [hashData setObject:[[NSMutableArray alloc] init] forKey:@"adr"];
    [hashData setObject:[[NSMutableArray alloc] init] forKey:@"url"];
    
    if (contact.imageData) {
        [hash setObject:[[NSNumber alloc] initWithBool:YES] forKey:@"image"];
    } else {
        [hash setObject:[[NSNumber alloc] initWithBool:NO] forKey:@"image"];
    }
    NSDate *modificationDate = [contact valueForProperty:@"modificationDate"];
    NSString *givenName = [contact valueForProperty:@"FirstName"];
    NSString *additionalName = [contact valueForProperty:@"MiddleName"];
    NSString *familyName = [contact valueForProperty:@"LastName"];
    NSString *nickname = [contact valueForProperty:@"Nickname"];
    NSString *honorificPrefix = [contact valueForProperty:@"Title"];
    NSString *honorificSuffix= [contact valueForProperty:@"Suffix"];
    NSString *jobTitle = [contact valueForProperty:@"JobTitle"];
    NSString *note = [contact valueForProperty:@"Note"];
    NSString *org = [contact valueForProperty:@"Organization"];
    ABMutableMultiValue *emails = [contact valueForProperty:@"Email"];
    ABMutableMultiValue *tel = [contact valueForProperty:@"Phone"];
    ABMutableMultiValue *url = [contact valueForProperty:@"URLs"];
    ABMutableMultiValue *adr = [contact valueForProperty:@"Address"];

    if ([modificationDate isKindOfClass:[NSDate class]]) {
        NSNumber *timestamp = [[NSNumber alloc] initWithInt:[modificationDate timeIntervalSince1970]];
        [hashData setObject:timestamp forKey:@"modificationDate"];
    }

    if ([givenName isKindOfClass:[NSString class]]) {
        [[hashData objectForKey:@"givenName"] insertObject:givenName atIndex:0];
    }
    
    if ([additionalName isKindOfClass:[NSString class]]) {
        [[hashData objectForKey:@"additionalName"] insertObject:additionalName atIndex:0];
    }
    
    if ([familyName isKindOfClass:[NSString class]]) {
        [[hashData objectForKey:@"familyName"] insertObject:familyName atIndex:0];
    }

    if ([nickname isKindOfClass:[NSString class]]) {
        [[hashData objectForKey:@"nickname"] insertObject:nickname atIndex:0];
    }

    if ([honorificPrefix isKindOfClass:[NSString class]]) {
        [[hashData objectForKey:@"honorificPrefix"] insertObject:honorificPrefix atIndex:0];
    }

    if ([honorificSuffix isKindOfClass:[NSString class]]) {
        [[hashData objectForKey:@"honorificSuffix"] insertObject:honorificSuffix atIndex:0];
    }

    if ([jobTitle isKindOfClass:[NSString class]]) {
        [[hashData objectForKey:@"jobTitle"] insertObject:jobTitle atIndex:0];
    }

    if ([note isKindOfClass:[NSString class]]) {
        [[hashData objectForKey:@"note"] insertObject:note atIndex:0];
    }

    if ([org isKindOfClass:[NSString class]]) {
        [[hashData objectForKey:@"org"] insertObject:org atIndex:0];
    }

    if (![emails isKindOfClass: nil]) {
        NSMutableDictionary *emailHash = [[NSMutableDictionary alloc] init];
        for (int i=0;i<emails.count;i++) {

            [emailHash setObject:[emails valueAtIndex:i] forKey:ABLocalizedPropertyOrLabel([emails labelAtIndex:i])];
        }
        [[hashData objectForKey:@"emails"] insertObject:emailHash atIndex:0];
    }

    if (![tel isKindOfClass: nil]) {
        NSMutableDictionary *phoneHash = [[NSMutableDictionary alloc] init];
        for (int i=0;i<tel.count;i++) {

            [phoneHash setObject:[tel valueAtIndex:i] forKey:ABLocalizedPropertyOrLabel([tel labelAtIndex:i])];
        }
        [[hashData objectForKey:@"tel"] insertObject:phoneHash atIndex:0];
    }

    if (![url isKindOfClass: nil]) {
        NSMutableDictionary *urlHash = [[NSMutableDictionary alloc] init];
        for (int i=0;i<url.count;i++) {

            [urlHash setObject:[url valueAtIndex:i] forKey:ABLocalizedPropertyOrLabel([url labelAtIndex:i])];
        }
        [[hashData objectForKey:@"url"] insertObject:urlHash atIndex:0];
    }

    if (![adr isKindOfClass: nil]) {
        NSMutableDictionary *adrHash = [[NSMutableDictionary alloc] init];
        for (int i=0;i<adr.count;i++) {
            NSMutableDictionary *a = [[NSMutableDictionary alloc] init];

            for (NSString *adrField in [adr valueAtIndex:i]) {
                if([adrField isEqualToString:@"Street"]) {
                    [a setObject:[[adr valueAtIndex:i] objectForKey:@"Street"] forKey:@"streetAddress"];
                }
                if([adrField isEqualToString:@"ZIP"]) {
                    [a setObject:[[adr valueAtIndex:i] objectForKey:@"ZIP"] forKey:@"postalCode"];
                }
                if([adrField isEqualToString:@"Country"]) {
                    [a setObject:[[adr valueAtIndex:i] objectForKey:@"Country"] forKey:@"countryName"];
                }
                if([adrField isEqualToString:@"City"]) {
                    [a setObject:[[adr valueAtIndex:i] objectForKey:@"City"] forKey:@"locality"];
                }
                if([adrField isEqualToString:@"State"]) {
                    [a setObject:[[adr valueAtIndex:i] objectForKey:@"State"] forKey:@"region"];
                }
            }
            [adrHash setObject:a forKey:ABLocalizedPropertyOrLabel([adr labelAtIndex:i])];
        }
        [[hashData objectForKey:@"adr"] insertObject:adrHash atIndex:0];
    }

    [hash setObject:hashData forKey:@"data"];
    return hash;
}
    +(NSData*)getContactImage:(NSString*)uid {
        ABPerson *contact = [[ABAddressBook addressBook] recordForUniqueId:uid];
        return [contact imageData];
    }
@end
