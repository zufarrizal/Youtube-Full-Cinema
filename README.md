# YouTube Full Cinema

YouTube Full Cinema is a lightweight Chrome extension that turns YouTube theater mode into a browser-window-sized cinema view. It keeps YouTube's own controls available, preserves page scrolling, and automatically collapses live chat when the current page is detected as a live stream.

## Features

- Expands YouTube theater mode to fill the browser viewport.
- Automatically enters theater mode once when a new video page is opened.
- Keeps YouTube's built-in theater/default button usable.
- Lets the normal YouTube layout return when you switch back to default view.
- Keeps the watch page scrollable so metadata, comments, and lower-page content remain accessible.
- Hides the YouTube masthead and navigation while Full Cinema is active.
- Automatically collapses live chat on live streams.
- Runs early with `document_start` to reduce visible layout delay.

## Supported Pages

The extension runs on:

- `https://www.youtube.com/watch?...`
- `https://www.youtube.com/live/...`
- Matching `https://youtube.com/*` pages

Full Cinema styling is only applied when the page is a YouTube watch/live page and the player is in theater mode.

## Installation

1. Open Chrome and go to `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this repository folder.
5. Open or refresh a YouTube video page.

After editing the extension files, reload the extension from `chrome://extensions` and refresh any open YouTube tabs.

## Usage

Open a YouTube video or live stream. The extension will try to enter theater mode once for each new video page.

Use YouTube's built-in theater/default button in the video controls to switch views:

- Theater mode enables the Full Cinema layout.
- Default view disables the Full Cinema layout and returns YouTube to its normal page layout.
- Opening another video resets the automatic theater-mode attempt.

For live streams, the extension clicks YouTube's own live chat collapse control once, so the chat panel closes using YouTube's native behavior.

## How It Works

The extension uses a Manifest V3 content script:

- `src/content.js` watches YouTube navigation events, page changes, resize events, and theater button clicks.
- `src/content.js` adds or removes CSS classes on the document root:
  - `yfc-full-cinema` enables the cinema layout.
  - `yfc-live` marks live stream pages while Full Cinema is active.
- `src/content.js` clicks YouTube's live chat collapse control when a live stream is detected.
- `src/content.css` adjusts only the active theater-mode player area so the video fills `100vw` by `100vh`.
- The script avoids repeatedly forcing theater mode after the user manually returns to default view.

## Project Structure

```text
.
+-- manifest.json
+-- README.md
+-- src
    +-- content.css
    +-- content.js
```

## Files

- `manifest.json` defines the Chrome extension, content script matches, and `document_start` injection timing.
- `src/content.js` handles YouTube page detection, theater-mode activation, live-stream detection, live chat collapse, and manual view toggles.
- `src/content.css` applies the Full Cinema layout and live chat fallback hiding rules.

## Notes

YouTube changes its DOM and player layout frequently. This extension intentionally keeps the implementation small and scoped to YouTube's current theater-mode structure. If YouTube updates player element names or layout behavior, selectors in `src/content.css` or `src/content.js` may need adjustment.

## License

This project is licensed under the terms included in the repository license file.
