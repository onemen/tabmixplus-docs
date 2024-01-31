---
title: Sessions Manager
sidebar:
  hidden: true
---

### Don't load tabs until selected (tabs not reloading automatically)
:::note
Mozilla removed the option "Don't load tabs until selected" from Firefox 47 user
interface.<br />
If you want to load all tabs immediately on Restore, go to `about:config` and set:<br />  `preference browser.sessionstore.restore_on_demand` to `false`.
:::


### Sessions Manager backup

Sessions are stored in the **session.rdf** file in your profile folder. A backup of this file is stored in the **sessionbackups** folder in your profile folder. If your session becomes corrupt and you are unable to restore that session, copy one of the backup files (tabmix_sessions-yyyy-mm-dd.rdf) from the backup folder to your profile folder, rename the file to <b>session.rdf</b>.


### Sessions Manager extension
For a full range of sessions managing features, you can use [Session Manager extension](https://addons.mozilla.org/en-US/firefox/addon/session-manager/) which is created specifically for that purpose.<br />
When Session Manager extension is installed, Tab Mix Plus turns its own session manager
off. Your existing sessions will be converted to SM format. This two extensions work well together without any known problems.<br />

**### IMPORTANT!** If you uninstall or disable Session Manager extension, Tab Mix
Plus will revert back to its file which will not have the sessions saved with Session Manager extension.


### Help page
<p>
Read more in our
<a href="../help/session-startexit.html" target="tabmix-help-content">Session Manager</a>
help page
</p>
