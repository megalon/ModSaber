# TODO List
Here is a list of items floating around that need to get done at some point or another.

## TODO:
*This is a list of items that should be done before launch.*

- [ ] Dependencies and Conflicts with versions
  * Use semver versions
  * Internally use caret Ranges: `^1.2.3`
  * API picks out the current release of the mod, saves that as a dependency
  * Mod installer 
- [ ] One-liner short description for the mod installer
- [ ] Refactor JSX files
  * ~~Organise into folders~~
  * Add `NoThis` support to turn all classes pure

## Big Refactor:
- [ ] Add API Versioning
- [ ] Remove old API endpoints (`/temp`)
- [ ] Clean up API endpoint names
- [ ] Keep Endpoint Consistency
  * Some endpoints use /:params
  * Some use body params
  * **PICK ONE AND STICK TO IT**

## Backburner
*These will probably get done eventually, but aren't quite important enough to do immediately. Some of these might end up being scrapped anyway.*

- [ ] Case-insensitive usernames
  * Probably have an internal "display name" that is the caps of when you signed up.
  * All other requests are done with the lowercase username
- [ ] Support other file types
  * Not mods get automatic versioning
  * Tagged appropriately

## Known bugs to fix
*These should be considered critial to get done.*

* NONE RIGHT NOW \o/
