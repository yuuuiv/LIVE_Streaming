# LIVE_Streaming

A live streaming video player built with Video.js for HLS streams.

## Features

- Full-screen video playback optimized for various devices
- Keyboard shortcuts: Space (play/pause), Left/Right arrows (rewind/fast-forward 5 seconds), S (screenshot)
- Touch gestures on mobile: Swipe left (rewind), swipe right (fast-forward)
- Screenshot functionality with camera icon button in the control bar
- Progress memory: Remembers last playback position using localStorage (may not apply to live streams)
- Responsive design with no scrollbars or borders

## Usage

1. Open `livestream/index.html` in a web browser.
2. The live stream will load and play automatically.
3. Use the controls or shortcuts to interact with the stream.

## Requirements

- A modern web browser with JavaScript enabled
- Internet connection for streaming videos

## Technologies Used

- [Video.js](https://videojs.com/) - HTML5 video player
- HLS streaming support via videojs-contrib-hls