# issue-10677-reproduction
Mongo database ops blocking the server for all users, unhandled by Fibers

Steps to reproduce:

`npm install`

`meteor run`

Visit localhost:3000 (or a different port, if specified).

Make sure you are viewing the server logs; it should start by printing '...' every 500ms.

Follow instructions in the browser, and please let me know if anything isn't clear.
