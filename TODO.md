# TODO List
Here is a list of items floating around that need to get done at some point or another.

## TODO:
*This is a list of items that should be done before launch.*

- [ ] Dependencies and Conflicts with versions
  * Use semver versions
  * Internally use caret Ranges: `^1.2.3`
  * API picks out the current release of the mod, saves that as a dependency 
  * Mod installer
- [ ] My Mods page
  * Accessible in navbar
  * Lists all mods and versions (including old ones)
  * **Potentially re-use homepage component but with other mods**
- [ ] Support other file types
  * Not mods get automatic versioning
  * Tagged appropriately
- [ ] Main page overhaul
  * Migrate endpoints
    * Use the full endpoint to get more data about each mod
    * Limit the number of mods to the top 5 (no groups)
    * Show more option (shows groups)
  * Grouping
    * Groups show when searching
    * Group in the same way as in the mod manager
  * Filters
    * Filter by: `type, version`
    * Have search too
- [ ] DaNike's Endpoint Requests
  * Add `/api/v1.0/mods/versions/:name`
    * Returns all versions of a mod that match the name
    * 404s on invalid name
  * Add `/api/v1.0/mods/semver/:name/:range`
    * 404s on invalid name
    * Returns an empty array if no mods found

## Backburner
*These will probably get done eventually, but aren't quite important enough to do immediately. Some of these might end up being scrapped anyway.*

- [ ] One-liner short description for the mod installer
- [ ] Case-insensitive usernames
  * Probably have an internal "display name" that is the caps of when you signed up.
  * All other requests are done with the lowercase username
- [ ] Admin Guidelines
  * Potentially bring on more admins

## Known bugs to fix
*These should be considered critial to get done.*

* NONE RIGHT NOW \o/
