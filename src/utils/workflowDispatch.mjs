import { Octokit } from '@octokit/rest';

const personalAccessToken = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

const owner = 'onemen';
const repo = 'TabMixPlus';

const workflowId = 'deploy.yml';

const octokit = new Octokit({ auth: personalAccessToken });

const payload = {
  ref: 'main',
  inputs: {
    run_releases: 'true',
  },
};

octokit.repos
  .createDispatchEvent({
    owner,
    repo,
    event_type: 'workflow_dispatch',
    workflow_id: workflowId,
    client_payload: payload,
  })
  .then(data => {
    console.log('Workflow triggered successfully:', data);
  })
  .catch(error => {
    console.error('Error triggering workflow:', error);
  });
