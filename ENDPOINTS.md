# `/registry`
```
GET  /registry/:name
GET  /registry/:name/:version
```

# `/auth`
```
POST /auth/register
POST /auth/login
GET  /auth/verify/:token
POST /auth/password/change
POST /auth/password/reset
POST /auth/reset
POST /auth/email/change
POST /auth/logout
```

# `/api/public`
```
GET  /api/public/all/new/:page?
GET  /api/public/all/approved/:page?
GET  /api/public/temp/approved
GET  /api/public/slim/new
GET  /api/public/slim/approved
GET  /api/public/pending
GET  /api/public/alert
GET  /api/public/gameversions
```

# `/api/secure`
```
GET  /api/secure/self
POST /api/secure/upload
POST /api/secure/edit
POST /api/secure/transfer
POST /api/secure/unpublish
POST /api/secure/gameversion
GET  /api/secure/admins
POST /api/secure/admins/modify
POST /api/secure/approve/:name/:version
POST /api/secure/revoke/:name/:version
POST /api/secure/weight/:name/:version
POST /api/secure/category/:name/:version
```
