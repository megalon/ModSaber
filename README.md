# ModSaber
Beat Saber Mod Database

## Setup
* Install Node.js 8 or higher
* Run `npm i` to install dependencies
* Run `node .` to run the server on port `3000`

## TODO:
* ~~Registry Routes that serve mod data~~
* ~~Implement Redis Route Caching~~
* ~~Docker~~
* ~~Docker Compose Rules~~
* Frontend UI
* Write Proper Readme
* ~~Password Resets~~
* Settings page
  * Change email
  * Change password
* Unpublish
  * Unpublished key in mod schema
  * Hidden from list all
  * 404s in registry
* Admin page
  * Promote / demote other admins
  * Add a new game version

## Frontend Plan
* ~~Navbar always at the top~~
  * ~~ModSaber (goes home)~~
  * Mod Installer *(This won't link anywhere until the new installer is out)*
  * ~~Modding Discord~~
  * ~~Upload a mod (hidden if not logged in)~~
  * ~~--- PINNED TO THE RIGHT SIDE~~
  * ~~Logged out:~~
    * ~~LOGIN~~
  * ~~Logged in:~~
    * ~~Username (goes to settings)~~
    * ~~Log Out~~
* ~~Front Page~~
  * ~~Lists latest mods~~
  * ~~Fetch list of all mods~~
  * ~~Remove older versions~~
  * ~~Fetch info on all~~
* ~~Login Page~~
  * ~~Username / password combo~~
  * ~~Use fetch API~~
* ~~Register Page~~
  * ~~Same deal as login~~
  * ~~Password confirmations~~
* Mod Page
  * ~~Lists all info about a mod~~
  * ~~Includes download link~~
  * ~~If logged in (or admin) show buttons to publish new version / unpublish~~
    * Make these work
* ~~Publish Page~~
  * ~~Form to publish a new mod~~
  * ~~Form fields:~~
    * ~~Name (disabled if editing an existing mod)~~
    * ~~Version~~
    * ~~Title~~
    * ~~Description~~
    * ~~Game Version (Dropdown, lists from API endpoint)~~
    * ~~Checkbox (enables oculus upload)~~
    * ~~Steam Upload~~
    * ~~Oculus Upload (hidden by default)~~
    * ~~Depends on (textbox that creates a list, verifies mod exists first)~~
    * ~~Conflicts with (same as above)~~
