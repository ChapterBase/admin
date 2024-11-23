import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import '@fontsource/roboto';
import Sidenav from './components/Sidenav';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state to prevent rendering issues

  const useQuery = () => new URLSearchParams(useLocation().search);

  const query = useQuery();
  const code = query.get('code');

  useEffect(() => {
    const processAuthentication = async () => {
      const idToken = localStorage.getItem('idToken');
      const accessToken = localStorage.getItem('accessToken');

      if (idToken && accessToken) {
        setIsAuthenticated(true);
        setLoading(false); 
        return;
      }

      if (code) {
        console.log('Authorization code received:', code);

        const clientId = '49k8pr50rs8j0011o9hkg8limj';
        const redirectUri = 'http://localhost:3000';
        const tokenEndpoint =
          'https://chapter-base.auth.ap-southeast-1.amazoncognito.com/oauth2/token';
        const codeVerifier = localStorage.getItem('pkce_code_verifier');

        console.log('Code verifier retrieved from localStorage:', codeVerifier);

        try {
          const response = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              grant_type: 'authorization_code',
              client_id: clientId,
              redirect_uri: redirectUri,
              code,
              code_verifier: codeVerifier,
            }),
          });

          console.log('Token endpoint response status:', response.status);
          const data = await response.json();
          console.log('Token response data:', data);

          const { id_token, access_token } = data;

          if (!id_token || !access_token) {
            console.error('Missing idToken or accessToken in response:', data);
            setLoading(false); // Stop loading if there's an error
            return;
          }

          // Save tokens to localStorage
          localStorage.setItem('idToken', id_token);
          localStorage.setItem('accessToken', access_token);

          console.log('idToken and accessToken saved to localStorage.');

          setIsAuthenticated(true);

          // Clear query parameters from the URL
          window.history.replaceState({}, document.title, '/');
        } catch (error) {
          console.error('Error during token exchange:', error);
          setLoading(false); // Stop loading if an error occurs
        }
      } else {
        console.log('User is not authenticated. Redirecting to login.');
        redirectToHostedUI();
      }
    };

    processAuthentication();
  }, [code]);

  const redirectToHostedUI = async () => {
    const clientId = '49k8pr50rs8j0011o9hkg8limj';
    const redirectUri = 'http://localhost:3000';
    const authorizationEndpoint =
      'https://chapter-base.auth.ap-southeast-1.amazoncognito.com/login';
    const codeVerifier = generateCodeVerifier();

    console.log('Generated code verifier:', codeVerifier);
    localStorage.setItem('pkce_code_verifier', codeVerifier);

    const codeChallenge = await generateCodeChallenge(codeVerifier);
    console.log('Generated code challenge:', codeChallenge);

    const loginUrl = `${authorizationEndpoint}?client_id=${clientId}&response_type=code&scope=email+openid+phone&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

    console.log('Redirecting to Hosted UI:', loginUrl);
    window.location.href = loginUrl;
  };

  if (loading) {
    return <h1>Loading...</h1>; // Show loading state while processing authentication
  }

  return isAuthenticated ? (
    <>
      <Sidenav />
    </>
  ) : (
    <div>
      <h1>Redirecting to Hosted UI...</h1>
    </div>
  );
}


// Helper Functions for PKCE
function generateCodeVerifier() {
  const randomString = Array.from(window.crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => String.fromCharCode(b))
    .join('');
  const verifier = btoa(randomString).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  console.log('Generated PKCE code verifier:', verifier);
  return verifier;
}

async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const challenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  console.log('Generated PKCE code challenge:', challenge);
  return challenge;
}

export default App;
