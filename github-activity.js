const https = require('https');
const readline = require('readline');

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

                const output = Object.entries(summary).map(([repoName, events]) => {
                    const eventDescriptions = Object.entries(events).map(([eventType, count]) => {
                        let action = '';

                        switch (eventType) {
                            case 'PushEvent':
                                action = `Pushed ${count} time${count > 1 ? 's' : ''}`;
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

                        return `  - ${action}`;
                    }).join('\n');

                    return `Repository: ${repoName}\n${eventDescriptions}`;
                });

                console.log('\n' + output.join('\n\n'));
            } else {
                console.log(`Error: ${res.statusCode} - ${res.statusMessage}`);
            }
        });
    });

    req.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
    });

    req.end();
}

const main = () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter GitHub Username: ', (username) => {
        console.log(`Fetching activity for ${username}...`);
        console.log(''); // Adding space before the menu

        console.log('Select the event type to filter by:');
        eventTypes.forEach((eventType, index) => {
            console.log(`${index + 1}. ${eventType}`);
        });

        rl.question('Enter the number corresponding to the event type: ', (choice) => {
            const selectedEventType = eventTypes[parseInt(choice) - 1] || 'All';
            getUserActivity(username, selectedEventType);
            rl.close();
        });
    });
}

main();
