# React Mail Client

A simple POP3 client based on [React](https://reactjs.org) and [PureCSS](https://purecss.io)

## How it works

- Sign up / Sign in
- Then create as many POP3 accounts as you want
- Then you might check any of your mailboxes

### Retrieving messages

Messages are stored in db once they've been fetched from the POP3 server.

1. When arriving to the Inbox, the client requests the server for in-DB messages AND new messages.
2. a. The server instantly sends back the first page of (simplified) results (only messages' id, sender, subject, date).
   b. It checks for new messages (UIDL). It computes the number of messages to be fetched, by comparing in-DB UIDLs to POP3 server UIDLs.
   c. As new messages are retrieved and parsed, they are pushed to the client through socket.io

### User stories

- User signs up (auto sign-in)
- User creates an account
- User goes to inbox