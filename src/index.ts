// server.ts
import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import createBitbucketWorkspace from './bitbucketWorkspace';

dotenv.config();

const app = express();
const port = 3001;

app.use(bodyParser.json());

const clientId = process.env.BITBUCKET_CLIENT_ID;
const clientSecret = process.env.BITBUCKET_CLIENT_SECRET;
const redirectUri = process.env.BITBUCKET_REDIRECT_URI;

app.get('/auth', (req, res) => {
  const state = 'some_random_state'; // Add your state logic here
  const authUrl = `https://bitbucket.org/site/oauth2/authorize?client_id=${clientId}&response_type=code&state=${state}&redirect_uri=${redirectUri}`;
  res.redirect(authUrl);
});

app.post('/auth/callback', async (req, res) => {
  const { code } = req.body;

  try {
    const params = new URLSearchParams();
    params.append('code', code);
    params.append('client_id', clientId!);
    params.append('client_secret', clientSecret!);
    params.append('redirect_uri', redirectUri!);
    params.append('grant_type', 'authorization_code');

    const tokenResponse = await axios.post('https://bitbucket.org/site/oauth2/access_token', params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token } = tokenResponse.data;

    // Fetch user information
    const userResponse = await axios.get('https://api.bitbucket.org/2.0/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const username = userResponse.data.username;

    // Respond with access token and username
    res.json({ access_token, username });
  } catch (error) {
    console.error('Bitbucket OAuth error:', (error as any).response?.data || (error as any).message);
    res.status(500).json({ error: 'Failed to exchange token or fetch user info' });
  }
});

app.post('/create-workspace', async (req, res) => {
  const { workspaceName, username, password } = req.body;
  console.log('Creating workspace:', workspaceName, username, password);
  try {
    console.log("entered try block");
    await createBitbucketWorkspace(workspaceName, username, password);
    console.log("exited try block")
    res.status(200).send('Workspace created successfully');
  } catch (error) {
    res.status(500).send('Error creating workspace');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
