const express = require('express');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const port = 3000;

// Replace with your Client ID and Client Secret
const CLIENT_ID = 'client-id';
const CLIENT_SECRET = 'secret-id';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

// Create an OAuth2 client with the given credentials
const oauth2Client = new OAuth2Client(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Generate a URL for the user to authenticate and authorize access
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'], // Add scopes as required
});

app.get('/', (req, res) => {
  res.send(`<a href="${authUrl}">Authenticate with Google</a>`);
});

app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;

  if (code) {
    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      res.send('Authentication successful! You can close this window.');

      console.log('Access Token:', tokens.access_token);
      console.log('Refresh Token:', tokens.refresh_token);
      console.log('Token Expiry:', tokens.expiry_date);
    } catch (error) {
      console.error('Error retrieving access token:', error);
      res.status(500).send('Authentication failed');
    }
  } else {
    res.status(400).send('No code provided');
  }
});

app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);

  // Dynamically import the 'open' module and open the URL
  const open = (await import('open')).default;
  open(`http://localhost:${port}`);
});