import re

# Fix NameController.m
with open('iOS-Baby-Names/Baby Names/NameController.m', 'r') as f:
    content = f.read()

# Change queryWithClassName:@"name" to @"Name"
content = content.replace('queryWithClassName:@"name"', 'queryWithClassName:@"Name"')
content = content.replace('queryWithClassName:@"names"', 'queryWithClassName:@"Name"')

# Replace the query execution to filter locally
old_query_logic = """        [query whereKey:@"gender" equalTo:genderLetter];
        
        if (self.letterString.length > 0) {
            [query whereKey:@"name" matchesRegex:[NSString stringWithFormat:@"%@.*", self.letterString ]];
        }
        
        if ([self.sortString isEqualToString:@"popular"]) {
            [query orderByAscending:@"rank"];
        } else if ([self.sortString isEqualToString:@"uncommon"]) {
            [query orderByDescending:@"rank"];
        } else if ([self.sortString isEqualToString:@"namesAtoZ"]) {
            [query orderByAscending:@"name"];
        } else if ([self.sortString isEqualToString:@"namesZtoA"]) {
            [query orderByDescending:@"name"];
        } else {
            [query orderByAscending:@"rank"];
        }
        
        query.limit = self.limitNumber;
        [query findObjectsInBackgroundWithBlock:^(NSArray *objects, NSError *error) {
            if (!error) {
                for (PFObject *object in objects) {
                    [self.names addObject:[object valueForKey:@"name"]];
                }
            } else {
            }
            [self.namesTable reloadData];
            [self setRandomName];
            [self.activityIndicator stopAnimating];
            [self.namesTable selectRowAtIndexPath:[NSIndexPath indexPathForRow:self.index inSection:0] animated:YES scrollPosition:UITableViewScrollPositionMiddle];
            [self setNameToUser];
        }];"""

new_query_logic = """        // No whereKey here to avoid Firestore index errors. We'll filter locally!
        query.limit = self.limitNumber;
        [query findObjectsInBackgroundWithBlock:^(NSArray *objects, NSError *error) {
            if (!error) {
                for (PFObject *object in objects) {
                    NSString *n = [object valueForKey:@"name"];
                    NSString *g = [object valueForKey:@"gender"];
                    if ([g isEqualToString:genderLetter] || [genderLetter isEqualToString:@"All"]) {
                        if (self.letterString.length == 0 || [[n lowercaseString] hasPrefix:[self.letterString lowercaseString]]) {
                            [self.names addObject:n];
                        }
                    }
                }
            } else {
                NSLog(@"Error fetching names: %@", error);
            }
            [self.namesTable reloadData];
            [self setRandomName];
            [self.activityIndicator stopAnimating];
            if (self.names.count > 0 && self.index < self.names.count) {
                [self.namesTable selectRowAtIndexPath:[NSIndexPath indexPathForRow:self.index inSection:0] animated:YES scrollPosition:UITableViewScrollPositionMiddle];
                [self setNameToUser];
            } else {
                self.name.text = @"No names found";
            }
        }];"""

content = content.replace(old_query_logic, new_query_logic)

with open('iOS-Baby-Names/Baby Names/NameController.m', 'w') as f:
    f.write(content)


# Fix NamesController.m
with open('iOS-Baby-Names/Baby Names/NamesController.m', 'r') as f:
    content = f.read()

content = content.replace('queryWithClassName:@"names"', 'queryWithClassName:@"Name"')
content = content.replace('queryWithClassName:@"name"', 'queryWithClassName:@"Name"')

with open('iOS-Baby-Names/Baby Names/NamesController.m', 'w') as f:
    f.write(content)

print("Fixed queries!")
