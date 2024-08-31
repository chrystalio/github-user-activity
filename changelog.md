# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), 
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2024-08-15

### Added
- User Existence Check: Implemented a validation step to check if a GitHub user exists before fetching their activity. This prevents unnecessary API calls and enhances error handling.

### Improved
- Error Handling: Enhanced error messages to provide clearer feedback when a user is not found or if there are issues fetching data from GitHub.

## [1.0.2] - 2024-08-14

### Added
- Styled ASCII Art: Integrated figlet to display a stylized ASCII art header with GitHub User Activity
- Colorized Output: Utilized chalk to enhance the CLI output with color, improving readability and visual appeal.

### Changes
- Updated the CLI tool to include a more visually engaging display, featuring a colored header and dynamic ASCII art.

## [1.0.1] - 2024-08-12

### Added
- Added a filtering feature allowing users to filter GitHub activity by event type.
- Implemented a menu system to select event types.
- Grouped and formatted activity output for better readability.

## [1.0.0] - 2024-08-11

### Added
- Initial implementation of fetching and displaying a GitHub user's recent activity using the GitHub API.