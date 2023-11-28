# Shares service
Menu shares created by the user. When a user wants to share one of its menu with someone else, they create a new share for that menu.

<!-- TOC -->
* [Shares service](#shares-service)
  * [Flow of sharing](#flow-of-sharing)
  * [What is shared?](#what-is-shared)
<!-- TOC -->

## Flow of sharing
When the user shares a menu with someone else, here is what happens behind the scene:

1. An email is sent to the share's `email` address.
2. The user clicks a link in the email to accept it.
   - If the user does not have an account, they will create one.
3. The menu will automatically appear in the user's menu bar on the left side.

Once a user as accepted the share, the owner of the menu has the control to remove the share if needed.

## What is shared?
Once a menu has been shared the following entities (only the ones that are used by the menu) is shared with the other user:

- Menu
- Tabs
- Forms
- Tables
- Actions
