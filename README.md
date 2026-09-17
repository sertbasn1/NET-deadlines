# NetDeadlines

Computer-networking conference deadline tracker published with GitHub Pages.

## Automatic deadline monitoring

The `Check conference deadlines` GitHub Actions workflow runs every Monday at
07:17 UTC and can also be started manually from the repository's **Actions**
tab. It checks the official venue URLs referenced by the site and compares
deadline-related page content with the previous run.

When a page changes, the workflow creates or updates one GitHub Issue named
`[Deadline Monitor] Review required`. Confirm the date on the official CFP
before replacing an estimated (`EST.`) date in `app/page.tsx`. The Issue stays
open until you review the reported pages and close it.

The first run creates a baseline and normally does not open an Issue.
