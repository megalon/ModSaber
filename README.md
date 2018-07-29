# ModSaber
Beat Saber Mod Database

## Setup
* Install Node.js 8 or higher
* Run `npm i` to install dependencies
* Run `node .` to run the server on port `3000`

## TODO:
- [x] Frontend UI
- [ ] Write Proper Readme
- [ ] Disable autocomplete to non-login forms
- [ ] Add approval system
  * Admins can approve a mod (and revoke it later)
  * ~~Approved mods have their own API listings~~

## Frontend Plan
* NONE RIGHT NOW \o/

## List of bugs
* NONE RIGHT NOW \o/

## Backburner
- [ ] Case-insensitive usernames
  * Probably have an internal "display name" that is the caps of when you signed up.
  * All other requests are done with the lowercase username
- [ ] Dependencies and Conflicts with versions
  * Use semver ranges
- [ ] Support other file types
  * Not mods get automatic versioning
  * Tagged appropriately
