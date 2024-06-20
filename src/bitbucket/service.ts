import axios from 'axios';

const BASE_URL = 'https://api.bitbucket.org/2.0';

interface BitbucketRepo {
  name: string;
  description?: string;
  is_private?: boolean;
}

export async function createRepository(accessToken: string, repoDetails: BitbucketRepo): Promise<any> {
  try {
    const response = await axios.post(
      `${BASE_URL}/repositories/${repoDetails.name}`,
      {
        scm: 'git',
        is_private: repoDetails.is_private || true,
        description: repoDetails.description || '',
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create repository: ${(error as any).message}`);
  }
}
