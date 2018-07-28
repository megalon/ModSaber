# ModSaber
Beat Saber Mod Database

## Setup
* Install Node.js 8 or higher
* Run `npm i` to install dependencies
* Run `node .` to run the server on port `3000`

## TODO:
- [ ] Frontend UI
- [ ] Write Proper Readme

## Frontend Plan
- [ ] Admin page
  - [ ] Promote / demote other admins
  - [ ] Add a new game version

## List of bugs
* ~~`strong` elements are dark~~
* Settings page doesn't check for login state
* Admin page doesn't do this either

## Backburner
- [ ] Case-insensitive usernames
  * Probably have an internal "display name" that is the caps of when you signed up.
  * All other requests are done with the lowercase username
