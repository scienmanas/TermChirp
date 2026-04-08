# TermChirp

**TermChirp** is a VS Code extension that plays meme sound notifications when your terminal commands succeed or fail — so you know instantly without staring at the screen.

## Features

- Plays a **success sound** when a terminal command exits with code `0`
- Plays a **error sound** when a command fails (non-zero exit code) or output matches common error patterns like `error`, `failed`, `exception`, etc.
- Activates automatically on startup — no manual triggering needed
- Ships with **8 bundled meme sounds** (4 success, 4 error)
- Sound selection via command palette

## Bundled Sounds

**Success**
| Name | Sound |
|---|---|
| `hehe_boy` | Hehe Boy *(default)* |
| `gta_mission_passed` | GTA Mission Passed |
| `mario_yahoo` | Mario Yahoo |
| `tada` | Ta-Da |

**Error**
| Name | Sound |
|---|---|
| `bruh` | Bruh *(default)* |
| `awkward_cricket` | Awkward Cricket |
| `haha` | Ha Ha (Nelson) |
| `windows_xp_error` | Windows XP Error |

## Commands

| Command | Description |
|---|---|
| `TermChirp: Set Success Sound` | Pick the success sound from bundled options |
| `TermChirp: Set Error Sound` | Pick the error sound from bundled options |

Open the command palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and search for `TermChirp`.

## Settings

| Setting | Type | Default | Description |
|---|---|---|---|
| `termchirp.successSound` | string | `hehe_boy` | Which bundled sound to play on success |
| `termchirp.errorSound` | string | `bruh` | Which bundled sound to play on error |

Settings can also be changed directly in `File → Preferences → Settings` by searching **TermChirp**.

## Requirements

- VS Code `^1.85.0`
- Shell integration must be enabled in your terminal (enabled by default for bash, zsh, fish, and PowerShell)

> **Note:** Sound playback relies on your OS audio player (`afplay` on macOS, `aplay`/`mpg123` on Linux, Windows Media Player on Windows). These are pre-installed on most systems.

## Known Issues

- Sound will not play if the terminal does not have shell integration active (e.g. some custom shells or SSH sessions)
- Pattern matching on terminal output requires VS Code 1.93+ (falls back to exit code only on older versions)

## Development

1. Clone the repository and open the `termchirp` folder in VS Code
2. Run `npm install`
3. Press `F5` to launch the Extension Development Host
4. Open a terminal in the new window and run any command to test

```bash
npm run compile   # one-time build
npm run watch     # watch mode
npm run package   # build .vsix for distribution
```

## License

MIT
