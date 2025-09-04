const axios = require('axios');
const webhookUrl = 'https://hooks.slack.com/services/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';
const event = process.env.GITLAB_EVENT;
const userName = process.env.GITLAB_USER_NAME;
const projectUrl = process.env.CI_PROJECT_URL;
const projectName = process.env.CI_PROJECT_NAME;
const mergeRequestId = process.env.CI_MERGE_REQUEST_IID;
const mergeRequestTitle = process.env.CI_MERGE_REQUEST_TITLE;

const getMessage = () => {
    switch (event) {
        case 'push':
            const branch = process.env.CI_COMMIT_REF_NAME;
            return `*Push Event*\nUser: *${userName}*\nBranch: *${branch}*\nProject: <${projectUrl}|${projectName}>`;
        case 'created':
            return `*Merge Request Created*\nTitle: *"${mergeRequestTitle}"*\nUser: *${userName}*\n[View Merge Request](${projectUrl}/-/merge_requests/${mergeRequestId})`;
        default:
            return '';
    }
};

const message = getMessage();

const sendSlackMessage = async (webhookUrl, message) => {
    if (message) {
        try {
            const response = await axios.post(webhookUrl, { text: message });
        } catch (error) {
            console.error('Error sending message to Slack:', error);
        }
    }
};

sendSlackMessage(webhookUrl, message);
