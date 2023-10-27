---
title: Privacy Policy
author: Upsilon Workshop team
date: 27 October 2023
---

## Preface

This document is a legal agreement between you and Upsilon Workshop. It
describes the terms and conditions under which you are allowed to use the
Upsilon Workshop website and services. If you do not agree to the terms and
conditions of this agreement, you are not allowed to use the Upsilon Workshop
website and services.

## Definitions

- "Upsilon Workshop" refers to the every service provided by Upsilon Workshop,
  including the website and the API

## Privacy Policy

### Information Collection and Use

Upsilon Workshop collects personal information when you register for a Upsilon
Workshop account (email address, username and hashed password). Upsilon Workshop
uses this information to provide you with the Service, and to contact you about
the services on our site in which you have expressed interest or to send you
notifications about the Service (for example, when if you are not respecting
the Terms of Service). Upsilon Workshop does not sell or rent your personal
information to third parties.

Upsilon Workshop automatically receives and records information on our server
logs from your browser, including your IP address, your user agent, and the pages you
request. This data is only used in the logs of the server and is not used for
any other purpose. For example, we do not use your IP address to track your
behavior on the website. This data can be used to help diagnose problems with
our servers, to administer the Service, and to gather broad demographic
information.

### Cookies

Upsilon Workshop does not use cookies, but we use localStorage to store your
preferences, so this is a kind of cookie.

List of cookies:

| Name                    | Description                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| `token`                 | This is the token used to authenticate you on the API.                                     |
| `dontShowDeleteConfirm` | This is used to know if you want to show the delete confirmation when you delete a script. |

We plan to allow you to fully disable cookies in the future, while still having
almost the same experience as with cookies enabled (by storing the data in the
RAM instead of in the localStorage).

### Analytics

Upsilon Workshop does not use any analytics tool.

### Third Party Services

The only third party service we use is the Google Fonts API, which is used to
load the fonts used on the website. You can find the privacy policy of the
Google Fonts API at https://policies.google.com/privacy.

### Data Deletion

Upsilon Workshop will retain your information for as long as your account is
active or as needed to provide you services. If you wish to cancel your account,
you can do so by going to the settings page and clicking on the
"Delete account". See the "Data Retention" section for more information about
the data retention.

### Correcting and Updating Your Personal Information

To review and update your personal information to ensure it is accurate, you
can do so by going to the settings page and editing your information. If an
information is not editable, you can contact us at the email address given in
the Terms of Service.

### Data Retention

Upsilon Workshop will retain your information for as long as your account is
active or as needed to provide you services.

Here is the explanation of the data retention:

- Encrypted dumps of the database are made every hour and are kept for 1 month,
  on the same server as the database. During this time, the dumps are also
  synced to two other places (my personal computer and my phone) and are
  encrypted with a password, in addition to the GPG encryption of the dumps.
  Theses dumps are removed 1 month after the deletion from the server, so they
  are kept for 2 months in total.
- In addition to database dump, a snapshot of the disk is made every day and are
  stored encrypted on another server. The last 14 snapshots are kept, so they
  are kept for 2 weeks.
- The logs of the server are kept for 2 month.

So, old data from the database is removed after 2 months.
Logs are deleted after 2 months and 2 weeks, since they are included in the
snapshots.

### Changes to this Privacy Policy

Upsilon Workshop may update this policy. We might notify you about significant
changes by sending a notice to the email address specified in your Upsilon
Workshop account or by placing a prominent notice on our site, but you should
check this page from time to time to ensure that you are aware of any changes.
We reserve the right to modify this privacy statement at any time, without any
notice, so please review it frequently.

## Other documents

- [Terms of Service](https://yaya-cout.github.io/Upsilon-Workshop/assets/legal/tos.pdf)