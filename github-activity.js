import https from 'https';
import readline from 'readline';
import chalk from 'chalk';
import figlet from 'figlet';

const eventTypes = [
    'PushEvent',
    'PullRequestEvent',
    'CreateEvent',
    'WatchEvent',
    'DeleteEvent',
    'IssueCommentEvent',
    'All'
];

const getUserActivity = (username, selectedEventType) => {
    const options = {
        hostname: 'api.github.com',
        path: `/users/${username}/events`,
        method: 'GET',
        headers: {
            'User-Agent': 'node.js'
        }
    };

    const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            if (res.statusCode === 200) {
                const events = JSON.parse(data);

                const filteredEvents = selectedEventType === 'All' ? events : events.filter(event => event.type === selectedEventType);

                const summary = filteredEvents.reduce((acc, event) => {
                    const repoName = event.repo.name;
                    const eventType = event.type;

                    if (!acc[repoName]) {
                        acc[repoName] = {};
                    }

                    if (!acc[repoName][eventType]) {
                        acc[repoName][eventType] = 0;
                    }

                    acc[repoName][eventType]++;
                    return acc;
                }, {});

                console.log(chalk.yellow('\nActivity Summary:'));

                const output = Object.entries(summary).flatMap(([repoName, events]) =>
                    Object.entries(events).map(([eventType, count]) => {
                        let action = '';

                        switch (eventType) {
                            case 'PushEvent':
                                action = `Pushed ${count} commit${count > 1 ? 's' : ''}`;
                                break;
                            case 'CreateEvent':
                                action = `Created ${count} event${count > 1 ? 's' : ''}`;
                                break;
                            case 'WatchEvent':
                                action = `Starred`;
                                break;
                            case 'DeleteEvent':
                                action = `Deleted ${count} event${count > 1 ? 's' : ''}`;
                                break;
                            case 'PullRequestEvent':
                                action = `Opened ${count} pull request${count > 1 ? 's' : ''}`;
                                break;
                            case 'IssueCommentEvent':
                                action = `Commented on ${count} issue${count > 1 ? 's' : ''}`;
                                break;
                            default:
                                action = `${eventType} (${count})`;
                        }

                        return chalk.green(`- ${action} in ${repoName}`);
                    })
                );

                output.forEach(line => console.log(line));
            } else {
                console.log(chalk.red(`Error: ${res.statusCode} - ${res.statusMessage}`));
            }
        });
    });

    req.on('error', (e) => {
        console.error(chalk.red(`Problem with request: ${e.message}`));
    });

    req.end();
}

const main = () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    figlet('GitHub User Activity', (err, data) => {
        if (err) {
            console.log(chalk.red('Something went wrong...'));
            console.dir(err);
            return;
        }
        console.log(chalk.blue(data));

        rl.question('Enter GitHub Username: ', (username) => {
            console.log(chalk.green(`Fetching activity for ${username}...`));

            console.log(chalk.cyan('Select the event type to filter by:'));
            eventTypes.forEach((eventType, index) => {
                console.log(chalk.magenta(`${index + 1}. ${eventType}`));
            });

            rl.question('\nEnter the number corresponding to the event type: ', (choice) => {
                const selectedEventType = eventTypes[parseInt(choice) - 1] || 'All';
                getUserActivity(username, selectedEventType);
                rl.close();
            });
        });
    });
}

main();
