# GitHub User Activity CLI

The GitHub User Activity CLI is an intuitive command-line tool crafted to fetch and elegantly display a GitHub user's recent activity. This tool transforms the conventional output into a visually engaging experience with colorized text and stylized ASCII art headers, making it not only more user-friendly but also visually appealing.

Inspired by a project idea from [roadmap.sh Backend Projects](https://roadmap.sh/backend/projects), this tool aligns with the platform’s mission to empower developers. Roadmap.sh is a community-driven resource that offers meticulously curated learning paths and innovative project ideas across various technology domains. It provides detailed "roadmaps," comprehensive guides that delineate the essential steps, skills, tools, and technologies necessary to master different tech roles effectively.

Whether you're a developer seeking to monitor your own project updates or a team lead needing to oversee your team's GitHub activities, this CLI tool offers a streamlined and enriched viewing experience, promoting greater productivity and insight into development workflows.

## Features
- Fetches and displays user activity from GitHub using their username.
- Colorizes output for enhanced readability.
- Displays ASCII art headers for a visually engaging experience.

### Prerequisites
Ensure you have Node.js installed on your machine. You can download it from [Node.js official website](https://nodejs.org/).

### Setup
1. **Clone the Repository**
   ```bash
   git clone https://github.com/chrystalio/github-user-activity
   cd github-user-activity
   ```
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. Running the Tool Execute the script by running:
    ```bash
    npm run start
    ```

Follow the prompts to enter a GitHub username and choose an event type to filter by. The tool will then fetch and display the user's recent activity.

### Usage Example
Here's an example of the tool in action:

```bash
Enter GitHub Username: chrystalio
Fetching activity for chrystalio...
Select the event type to filter by:
1. PushEvent
2. PullRequestEvent
3. CreateEvent
4. WatchEvent
5. DeleteEvent
6. IssueCommentEvent
7. All
Enter the number corresponding to the event type: 1
```

The tool will then display the activity for the specified user, filtered by the selected event type, with the output styled with color and ASCII art.

## Contributing
Contributions to enhance the GitHub User Activity CLI are welcome. Please ensure to update tests as appropriate.

# Acknowledgments

This project is made possible with the help of the following libraries and resources:

- **[chalk](https://www.npmjs.com/package/chalk)** - For adding color to the command line output, enhancing readability and user experience.
- **[figlet](https://www.npmjs.com/package/figlet)** - Used to generate ASCII art from text, making the CLI output visually appealing.
- **[Node.js](https://nodejs.org/)** - The runtime environment that powers the backend of this CLI tool.
- **[roadmap.sh](https://roadmap.sh/)** - Inspired by project ideas from this community-driven platform, which offers learning paths and guides in various tech domains.

Special thanks to all the developers and contributors of these tools for making them available and maintaining them, enabling us to build more efficient and appealing software solutions.
