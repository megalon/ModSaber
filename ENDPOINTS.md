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

# `/api/v1.0/admin`
```
POST /api/v1.0/admin/approve-mod
POST /api/v1.0/admin/revoke-approval
POST /api/v1.0/admin/set-weight
POST /api/v1.0/admin/set-category
```

# `/api/v1.0/files`
```
POST /api/v1.0/upload/publish
POST /api/v1.0/upload/edit
POST /api/v1.0/upload/transfer
POST /api/v1.0/upload/unpublish
```

# `/api/v1.0/mods`
```
GET  /api/v1.0/mods/pending
GET  /api/v1.0/mods/new/:page?
GET  /api/v1.0/mods/approved/:page?
```

# `/api/v1.0/slim`
```
GET  /api/v1.0/slim/new
GET  /api/v1.0/slim/approved
```

# `/api/v1.0/site`
```
GET  /api/v1.0/site/alert
GET  /api/v1.0/site/gameversions
POST /api/v1.0/site/gameversions
```

# `/api/v1.0/users`
```
GET  /api/v1.0/users/self
GET  /api/v1.0/users/admins
POST /api/v1.0/users/admins
```
