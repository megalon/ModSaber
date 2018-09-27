# Changelog
All notable changes to this project will be documented in this file.

## [0.7.5] - 2018-09-27
### Added
- Fuzzy searching to Mods list component
### Changed
- Link colour, now has more visual contrast on the dark background
- `/mods/mine` --> `/mods/by-user/:username`  
  Updated MyMods page to accommodate  
  Paves the way for a mod author page
### Fixed
- My mods page having incorrect message when no mods have loaded
- API results not showing file listings
- Publish autofill for unapproved mods based on version
- Column widths on mod page causing content to overflow

## [0.7.4] - 2018-09-25
### Added
- 'My Mods' page.  
  Allows you to see all the mods you currently have published.
- Autofocus to input fields around the site
### Changed
- Home page layout.  
  Now groups mods by category, similar to the Mod Manager.

## [0.7.3] - 2018-09-25
### Added
- This changelog! \o/
- New endpoints at the request of DaNike:  
  - `/api/v1.0/mods/versions/:name` Returns all versions of a mod that match the name
  - `/api/v1.0/mods/semver/:name/:range` Returns all mods that satisfy the given semver range

## [0.7.2] - 2018-09-22
### Changed
- Allowed unapproved mods to render meta tags
### Fixed
- Navbar shadow not rendering properly
- Table headers using the wrong font colour

## [0.7.1] - 2018-09-07
### Added
- Support for `kbd` elements in Markdown renderer.  
  Use `||Key||` syntax to render.
- Styles for `kbd` elements shamelessly ripped from Discord
### Changed
- Refactored Markdown renderer to higher-order component for easy re-use

## [0.7.0] - 2018-09-07
### Added
- Dependencies and Conflicts.  
  Handles these internally as semver caret ranges.
### Changed
- Only remove approvals for mods incompatible with the latest game version
### Fixed
- Mongoose update not allowing `.` character in key names
- Upload UI now handles server error `500`s correctly

## [0.6.3] - 2018-09-06
### Changed
- Updated client and server packages
- Refactoring of Mongoose models
### Fixed
- Optimised the React DOM tree for performance benefits
### Security
- SSR now runs under a proxy properly. Fixed to handle client IPs correctly for auditing.

## [0.6.2] - 2018-09-04
### Removed
- `/api/public/temp/approved`  
  Use `/api/v1.0/mods/approved`

## [0.6.1] - 2018-09-04
### Fixed
- Add redirect for `/api/public/gameversions` so the Mod Manager still works

## [0.6.0] - 2018-09-04
### Changed
- Massive internal endpoint refactor (see `ENDPOINTS.md`)
### Deprecated
- `/api/public/temp/approved`

## [0.5.5] - 2018-09-03
### Added
- Mod categories. Allows you to sort mods for the Installer.
### Changed
- Interally refactor `tag` to `type` in the database.  
  No longer just a shim added after the fact.
- Interally preparing for upcoming endpoint refactor
### Fixed
- Hang when trying to register a new account with an existing username.  
  Now shows the error correctly.

## [0.5.4] - 2018-09-03
### Added
- Approval Webhooks.  
  Can now post to a Discord channel when a mod is approved / unapproved.

## [0.5.3] - 2018-08-31
### Added
- `META` tags for Mods page on SSR. Allows hotlinked mods to expand properly on Discord.

## [0.5.2] - 2018-08-31
### Added
- `PNG` version of the favicon
### Changed
- Site `meta` theme colour from black to purple
- Now sorts API results alphabetically by name after weighting

## [0.5.1] - 2018-08-31
### Changed
- File name format. Now includes the mod name as a prefix, and drops the `-default` suffix.  
  `-steam` and `-oculus` suffixes are still included where appropriate.
### Security
- Fixed SSR page permissions. Will no longer render pages that users should not be able to see.

## [0.5.0] - 2018-08-22
### Added
- Server-side Rendering! Initial page load time should be much faster.
### Changed
- Changed to ModSaber [BETA] in the navbar to better reflect the state of the site
### Deprecated
- Old URL format using `/#/`. A redirect is in place for now.
### Fixed
- A Markdown renderer not working server-side. Now waits for the page to be hydrated on the client.

## [0.4.0] - 2018-08-22
### Added
- Syntax highlighting to Markdown renderer
- Mod listing page now saves what page you're looking at and persists across reloads
### Changed
- Game version on the mods page now highlights red if not the latest version
### Fixed
- Game version on Mods page showing the internal ID instead of the version string
- Edit page crashes if any errors occur

## [0.3.5] - 2018-08-21
### Added
- Game version info to Mods page
### Fixed
- React context provider not working

## [0.3.4] - 2018-08-17
### Added
- Official ModSaber logo!
- Healthcheck endpoint to NGINX container
- Google Analytics
### Changed
- A shitload of internal refactoring. Organised routes and components into directories.
### Fixed
- Incorrect name in `manifest.json`

## [0.3.3] - 2018-08-14
### Changed
- A lot of internal refactoring, should help with performance
- Updated client and server packages

## [0.3.2] - 2018-08-13
### Added
- Pagination on the home page for when there are lots of mods
- Drafts for the upload page. Drafts are saved for 10 minutes and reset when published.
### Changed
- Internal refactoring of File Field component

## [0.3.1] - 2018-08-13
### Added
- Server-side logging. Will help to diagnose errors and aduit admin actions.

## [0.3.0] - 2018-08-05
### Added
- Edit mods page. You can now edit the title and description without uploading a new version!
### Changed
- Now checks the magic number of the uploaded file, rather than the reported mime type. Should fix problems with `octet-stream` uploads in Firefox.
- Now filters out empty directories in the file listing
### Fixed
- Old versions of unapproved mods showing in the pending endpoint. Now only shows the latest version pending approval.

## [0.2.0] - 2018-08-04
### Added
- Preview window for writing Markdown descriptions
### Fixed
- Description box character limit now increased to match the new limit

## [0.1.2] - 2018-08-03
### Added
- Now lists the mime-type of uploaded file if it is invalid
### Fixed
- Spacing on file error message field

## [0.1.1] - 2018-08-02
### Added
- Temporary endpoint for the Mod Manager
- Added published timestamp
- Added mod details and timestamp to Mods page
### Changed
- Upped the description character limit from `1000` to `10,000`
- Externally renamed `tag` key to `type`
- Changed the filename for mods with no alternate oculus version
- Marked dependency and conflict fields as Work In Progress
### Fixed
- Link hover colours
### Security
- Added more file extensions to the block list

## [0.1.0] - 2018-08-02
- First functional release
