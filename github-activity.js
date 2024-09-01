import https from 'https';
import readline from 'readline';
import chalk from 'chalk';
import figlet from 'figlet';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CACHE_DIR = path.join(__dirname, 'cache');
const CACHE_MAX_AGE = 86400000; // 1 day in milliseconds
const CACHE_TTL = 300000; // 5 minutes in milliseconds

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR);
}

const clearOldCacheFiles = () => {
    console.log(chalk.blue('Checking for old cache files to clear...'));

    const files = fs.readdirSync(CACHE_DIR);

    files.forEach(file => {
        const filePath = path.join(CACHE_DIR, file);
        const stats = fs.statSync(filePath);
        const fileAge = Date.now() - stats.mtimeMs;

        if (fileAge > CACHE_MAX_AGE) {
            fs.unlinkSync(filePath);
            console.log(chalk.red(`Deleted old cache file: ${file}`));
        }
    });

    console.log(chalk.green('Cache cleanup complete.'));
};

const eventTypes = [
    'PushEvent',
    'PullRequestEvent',
    'CreateEvent',
    'WatchEvent',
    'DeleteEvent',
    'IssueCommentEvent',
    'All'
];

const checkUserExists = (username, callback) => {
    const options = {
        hostname: 'api.github.com',
        path: `/users/${username}`,
        method: 'GET',
        headers: {
            'User-Agent': 'node.js'
        }
    };

    const req = https.request(options, (res) => {
        let result = '';
        res.on('data', (chunk) => {
            result += chunk;
        });

        res.on('end', () => {
            if (res.statusCode === 404) {
                console.log(chalk.red(`Error: User ${username} not found.`));
                callback(false);
            } else if (res.statusCode === 200) {
                callback(true);
            } else {
                console.log(chalk.red(`Error: Failed to fetch user data. Status Code: ${res.statusCode}`));
                callback(false);
            }
        });
    });

    req.on('error', (e) => {
        console.error(chalk.red(`Problem with request: ${e.message}`));
        callback(false);
    });

    req.end();
};

const getUserActivity = (username, selectedEventType) => {
    const cacheKey = `${username}_${selectedEventType}.json`;
    const cacheFilePath = path.join(CACHE_DIR, cacheKey);

    // Check if the cache exists and is still valid (TTL of 5 minutes)
    if (fs.existsSync(cacheFilePath)) {
        const stats = fs.statSync(cacheFilePath);
        const fileAge = Date.now() - stats.mtimeMs;

        if (fileAge < CACHE_TTL) {
            console.log(chalk.green('\nUsing cached data...'));
            const cachedData = JSON.parse(fs.readFileSync(cacheFilePath, 'utf-8'));

            // Process and display cached data directly
            const summary = cachedData.reduce((acc, event) => {
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

            return;
        } else {
            console.log(chalk.yellow('Cache expired. Fetching new data...\n'));
        }
    }

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
                fs.writeFileSync(cacheFilePath, JSON.stringify(events));

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
};



const main = () => {
    clearOldCacheFiles();

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
            checkUserExists(username, (exists) => {
                if (!exists) {
                    rl.close();
                    return;
                }

                console.log(chalk.green(`Fetching activity for ${username}...`));

                console.log(chalk.cyan('Select the event type to filter by:'));
                eventTypes.forEach((eventType, index) => {
                    console.log(chalk.magenta(`${index + 1}. ${eventType}`));
                });

                rl.question('\nEnter the number corresponding to the event type: ', (choice) => {
                    const selectedEventType = eventTypes[parseInt(choice) - 1] || 'All';
                    getUserActivity(username, selectedEventType );
                    rl.close();
                });
            });
        });
    });
}

main();
