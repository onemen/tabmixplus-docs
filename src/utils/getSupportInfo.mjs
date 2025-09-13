/**
 * @returns {Promise<{date: string, users: number, amount: number} | null>}
 */
export async function getSupportInfo() {
  const { GITHUB_PERSONAL_ACCESS_TOKEN_ADDON, GIST_ID, GIST_FILENAME } = import.meta.env;

  try {
    const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: {
        Authorization: `Bearer ${GITHUB_PERSONAL_ACCESS_TOKEN_ADDON}`,
        Accept: 'application/vnd.github+json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const gist = await response.json();
    const fileContent = gist.files[GIST_FILENAME]?.content;
    if (fileContent) {
      const { users, amount, date } = JSON.parse(fileContent);
      const dateObj = new Date(date);
      const formatted = dateObj.toLocaleString('en-US', {
        month: 'long',
        year: 'numeric',
      });
      return { users, amount, date: formatted };
    }
    throw new Error(`File ${GIST_FILENAME} not found in Gist.`);
  } catch (error) {
    console.error('Error fetching Gist data:', error);
    return null;
  }
}
