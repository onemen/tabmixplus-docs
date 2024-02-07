---
title: Tab Mix Plus does not work properly
sidebar:
  order: 1
---

If you are reading this page, you have probably encountered a problem with Tab Mix Plus. While it
can be some unknown bug, most issues reported in the forum usually end up being extensions or theme
conflicts.

In order to identify and solve the problem there are several things you can do.

### Install latest development version

First, install the latest development version to see if the problem might have been fixed (look for
the latest test build at
[our Downloads page](https://bitbucket.org/onemen/tabmixplus-for-firefox/downloads/)). You can
reinstall the [latest official version](https://github.com/onemen/TabMixPlus/releases/) in place of
the development version later if you wish.

If the latest development version still has the problem then the place to post about it is in the
[ discussions ](https://github.com/onemen/TabMixPlus/discussions) section of our repository, but
before you post there are a few more things to try.

### Create new testing profile

Create a
[new profile](https://support.mozilla.org/en-US/kb/profile-manager-create-and-remove-firefox-profiles)
(Creating new profile is safe and doesn't have any effect on your current profile, which you can
return to using once you complete testing the new profile), install Tab Mix Plus and import your
preferences from the problematic profile. If you don't see the problem, it's most likely a conflict
with another extension. Install your extensions one by one restarting in between until the issue
reappears (once you isolate the conflicting extension(s), you don't have to use the new profile
unless you want to).

### Disable other extensions

If you prefer not to create a new profile for testing, you can try disabling your other extensions
in the current profile instead. Then enable each extension one by one and test for the problem.

Note: This is not as good as creating a clean profile because the conflict may be an option choice
or another customization made in the browser and not another extension.

If you have a high number of extensions, a way to expedite this troubleshooting is to disable half
of the installed extensions at a time. If the problem disappears, then you know that the conflicting
extension is one of those you just disabled.

If this is still a high number of extensions, you can enable half of those extensions and check for
the problem. If and when you get to a more manageable number of extensions, you can then
enable/disable extensions one at a time until you isolate the one conflicting with Tab Mix Plus.

### Reset your profile

Finally, if nothing else works you can reset your profile, read the article
[Reset Firefox - easily fix most problems](https://support.mozilla.org/en-US/kb/reset-firefox-easily-fix-most-problems)
from Mozilla support.

### Report your finding

When you finish your testing, we encourage you to report about your findings, whether you find the
culprit or not, to our forum, so other users can benefit from your findings and to help Tab Mix Plus
developers to solve the issue you have. (Read [How to post about a problem](../how-to-post)). In the
case the conflict is another extension or theme, please report about it to the developer of the
conflicting extension or theme also so that they can work it out as well.
