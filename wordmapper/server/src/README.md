# Server

The server has 3 parts:
1. A public facing splash page instructing users on how to install the client tool (i.e. bookmarklet).
2. An admin interface to manage users.
3. An API that the client tool uses in order to persist alignments on source texts.

## API Endpoints

Endpoint | Methods | Description
--- | --- | ---
/api/auth | POST | Resource for authenticating (i.e. login). Returns a JWT that must be used for authenticated requests.
/api/alignments | GET,POST,PUT,DELETE | Resource that describes alignments on a set of source texts.
/api/pages | GET,POST | Resource that describes the webpages containing source texts.

