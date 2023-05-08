Introduction

Code for a Power-Up in Trello that tracks lists with a keyword and the card movement in those. Probably.
Currently made for this: https://trello.com/b/ZoVZDKTr/testroom It wants to be a Power-Up some day.
Ding because it sort-of dings when something changes.

Working:
* Lists with -top data displayed
* Moving cards from lists with -top to lists without -top shows that card has been moved but doesn't show where
* Checks every 10sec for new cards in -top lists
* Moving cards between all lists - from no-top lists show a new card is added, from top to top lists shows card is moved from list name to list name
* Adding cards to -top lists shows a card added but non-top lists don't

Things that don't work and maybe don't need to:
* When changing a list name to include -top log will display all cards in that list as they were just added and when removing -top it will log that they were deleted
> Add bit to log that a new -top list was made?
* Removing cards (archive) doesn't show anything in log. Neither does deleting them from archive.
> Get this part working if a card is archived/deleted. Or is it really necessary.....?

Changes:
*Changed first fetch to look at lists instead of cards. 
