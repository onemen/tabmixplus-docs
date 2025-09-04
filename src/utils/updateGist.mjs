import { Octokit } from '@octokit/rest';

const {
  GIST_ID,
  GIST_FILENAME,
  ALL_INFO_FILENAME,
  TABMIXPLUS_GITHUB_TOKEN: GIST_TOKEN,
} = process.env;

function getData() {
  // Get data from command line arguments
  const args = process.argv.slice(2).reduce((acc, arg) => {
    const [key, value] = arg.split('=');
    acc[key] = value;
    return acc;
  }, {});

  const { users: usersStr, amount: amountStr, date: dateStr, create: createStr } = args;
  const create = createStr === 'true';

  if (!GIST_TOKEN) {
    console.error('GIST_TOKEN must be set in your environment variables.');
    process.exit(1);
  }

  if (!create && !GIST_ID) {
    console.error(
      'GIST_ID must be set in your environment variables when not creating a new gist.'
    );
    process.exit(1);
  }

  if (!usersStr || !amountStr || !dateStr) {
    console.error('Please provide users, amount, and date as arguments.');
    console.error(
      'Example: node src/utils/updateGist.mjs users=999 amount=9999 date=2025-08 [create=true]'
    );
    process.exit(1);
  }

  const users = parseInt(usersStr, 10);
  const amount = parseInt(amountStr, 10);
  // Create a date object and format it to YYYY-MM
  const rawDate = new Date(dateStr);
  const date = `${rawDate.getFullYear()}-${String(rawDate.getMonth() + 1).padStart(2, '0')}`;

  return { users, amount, date, create };
}

async function updateGist() {
  const { users, amount, date, create } = getData();

  const octokit = new Octokit({ auth: GIST_TOKEN });

  // Get the existing gist to retrieve allInfo.json
  let allInfoData = {};
  if (!create) {
    try {
      const gist = await octokit.gists.get({
        gist_id: GIST_ID,
      });

      const allInfoFile = gist.data.files[ALL_INFO_FILENAME];
      if (allInfoFile && allInfoFile.content) {
        allInfoData = JSON.parse(allInfoFile.content);
      }
    } catch (error) {
      // If the gist doesn't exist, we'll create it.
      // If it exists but the file doesn't, we'll add it.
      if (error.status !== 404) {
        throw error;
      }
    }
  }

  // Create the content for info.json (single month)
  const infoContent = JSON.stringify({ users, amount, date }, null, 2);

  // Create/update the content for allInfo.json (all months)
  allInfoData[date] = { users, amount };
  const allInfoContent = JSON.stringify(allInfoData, null, 2);

  const files = {
    [GIST_FILENAME]: { content: infoContent },
    [ALL_INFO_FILENAME]: { content: allInfoContent },
  };

  if (create) {
    console.log('Creating a new Gist...');
    const { data: newGist } = await octokit.gists.create({
      files,
      public: false,
      description: 'TabMixPlus Support Data',
    });
    console.log('New Gist created successfully:');
    console.log(`- ID: ${newGist.id}`);
    console.log(`- URL: ${newGist.html_url}`);
  } else {
    // Update the gist with the two files
    console.log(`Updating Gist ${GIST_ID}...`);
    await octokit.gists.update({
      gist_id: GIST_ID,
      files,
    });

    console.log('Gist updated successfully with two files:');
    console.log(`- ${GIST_FILENAME}`);
    console.log(`- ${ALL_INFO_FILENAME}`);
  }
}

updateGist().catch(error => {
  console.error('Failed to update Gist:', error.message);
  process.exit(1);
});
