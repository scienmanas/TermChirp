# Changelog

All notable changes to TermChirp will be documented in this file.

## [1.0.0] - 2026-04-01

### Added

- Terminal command success/failure detection via VS Code Shell Integration API
- Exit code detection — non-zero exit triggers error sound
- Output pattern matching for common error keywords (`error`, `failed`, `exception`, `command not found`, `not recognized`)
- 8 bundled meme sounds — 4 success (`hehe_boy`, `gta_mission_passed`, `mario_yahoo`, `tada`) and 4 error (`bruh`, `awkward_cricket`, `haha`, `windows_xp_error`)
- `TermChirp: Set Success Sound` command — QuickPick to choose bundled success sound
- `TermChirp: Set Error Sound` command — QuickPick to choose bundled error sound
- `termchirp.successSound` and `termchirp.errorSound` settings with enum validation
- Auto-activates on VS Code startup (`onStartupFinished`)
