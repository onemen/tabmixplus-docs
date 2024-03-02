import { Octokit } from '@octokit/rest';

const owner = 'onemen';
const repo = 'tabmixplus-docs';

const octokit = new Octokit({ auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN });

octokit.actions
  .createWorkflowDispatch({
    owner,
    repo,
    workflow_id: 'deploy.yml',
    ref: 'main',
    inputs: {
      run_releases: 'true',
    },
  })
  .then(data => {
    console.log('Workflow triggered successfully:', data.status);
  })
  .catch(error => {
    console.error('Error triggering workflow:', error);
  });
