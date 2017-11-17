# Section From Content

A ghost app to let you extract sections from content in a page/post.

Don't use it unless you know what you're doing. This could break on any ghost
update and possibly break your whole site. We'll try to keep it updated, but
no guarantees. You probably won't be able to depend on this in a marketplace
theme.

## Usage

In your ghost editor, add a section to a page or post:

```html
<!-- section: a description of the section

the section's content

-->
```

![example page](/test-page.png)

Then, use the `sectionFromContent` helper to access the section.

```hbs

{{{sectionFromContent "section" html}}}

```

Sections are not escaped and are parsed with [`marked`][marked] for markdown.
Markdown may work differently then normal with Ghost.

[marked]: https://github.com/chjj/marked

## Installation

Clone this repo into your `content/apps` directory.

We've included a simple setup script. Run it.

```node
node setup.js
```

<small>To uninstall later, just edit the script to "remove" instead of install, then run.</small>

Next, we need to allow custom helpers specified by env variables to be used
in themes. If [this PR][env-pr] has been merged, you can skip this step.
Otherwise, you must monkey-patch gscan.

Open `current/node_modules/gscan/lib/spec.js` and change this section:

```js
knownHelpers = [
    ...
];
```

to this:

```js
knownHelpers = [
    ...
].concat((process.env.GSCAN_ALLOW_HELPERS || '').split(','));
```

Then, run ghost with an env variable allowing the helper.

    $ GSCAN_ALLOW_HELPERS=sectionFromContent ghost restart

You can now activate a theme that requires this app. Make sure to run this
command every time you need to activate a theme that requires this app.

[env-pr]: https://github.com/TryGhost/gscan/pull/91
