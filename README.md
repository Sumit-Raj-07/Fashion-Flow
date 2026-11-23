# Fashion Flow

A digital design-review workflow for fashion projects. Designers, clients and production managers manage sketches, fabric choices, revisions and approvals in one place, without losing earlier design versions.

Built as a first-semester team project with plain HTML, CSS and JavaScript. There is no server or database. All data is saved in the browser (localStorage).

## Features

- **Home page** with a hero banner and sample sketches
- **Login with three roles:** Designer, Client and Production Manager
- **Designer**
  - Add a sketch with image, fabric, colour and notes
  - Save it as a draft or send it to the client
  - Revise a design when the client asks for changes
  - Delete drafts
- **Client**
  - Ask for changes (a comment is required) or approve a design
- **Production Manager**
  - Sees only client-approved designs and accepts or rejects them
- **Comments** on every design, for all three users
- **Version history** on every design, with a dated record of each step and the old fabric and colour kept on every revision
- **Stages:** designs are grouped into Draft, In Review and Approved

## How the workflow works

```
Draft  ->  Pending Client Review  ->  Approved by Client  ->  Accepted / Rejected
                 |        ^
                 v        |
         Changes Requested -> Designer revises (new version)
```

## Demo logins

| Role | Username | Password |
|---|---|---|
| Designer | `designer` | `1234` |
| Client | `client` | `1234` |
| Production Manager | `production` | `1234` |

## How to run

1. Download or clone this repository.
2. Open `index.html` in any web browser.

No installation or internet connection is needed. To reset the data to the sample designs, clear the site's data in your browser, or run `localStorage.clear()` in the browser console.

## Project structure

```
index.html
logo.svg
css/
  person1.css
  person2.css
  person3.css
js/
  person1.js
  person2.js
  person3.js
sketches/
  dress.svg, jacket.svg, shirt.svg, trousers.svg, skirt.svg
```

## Team

| Member | Part | Files |
|---|---|---|
| [Name], Person 1 | Home page, navbar and logo, shared data and helpers, start-up | `css/person1.css`, `js/person1.js` |
| [Name], Person 2 | Login and the designer: add, draft, send, revise and delete sketches | `css/person2.css`, `js/person2.js` |
| Sumit Raj, Person 3 | Design cards, stages, comments, version history, client and production manager | `css/person3.css`, `js/person3.js` |

## Built with

HTML5, CSS3 and JavaScript (no libraries or frameworks).
