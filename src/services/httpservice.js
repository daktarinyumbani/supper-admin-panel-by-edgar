export const apiURL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace(/\/$/, '')
  : '';

const normalizePath = (value = '') => String(value).replace(/^\/+|\/+$/g, '');

/**
 * Get Authorization header safely
 */
const getTokenHeader = () => {
  const tokenString = localStorage.getItem('token');

  if (!tokenString) {
    return {};
  }

  try {
    const parsed = JSON.parse(tokenString);
    let tokenPlain = parsed;

    if (
      parsed
      && parsed.token
      && parsed.token.plainTextToken
    ) {
      tokenPlain = parsed.token.plainTextToken;
    } else if (
      parsed
      && parsed.plainTextToken
    ) {
      tokenPlain = parsed.plainTextToken;
    } else if (
      parsed
      && parsed.token
      && typeof parsed.token === 'string'
    ) {
      tokenPlain = parsed.token;
    }

    return {
      Authorization: `Bearer ${tokenPlain}`
    };
  } catch (error) {
    return {
      Authorization: `Bearer ${tokenString}`
    };
  }
};

/**
 * Default headers for all requests
 */
export const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

/**
 * Safely construct full URL
 */
const buildURL = (endpoint) => {
  const cleanEndpoint = normalizePath(endpoint);
  return `${apiURL}/${cleanEndpoint}`;
};

/**
 * Parse response safely
 */
const parseResponse = async (response, method, url) => {
  const contentType = response.headers.get('content-type');
  let responseBody = null;

  try {
    if (contentType && contentType.includes('application/json')) {
      responseBody = await response.json();
    } else {
      responseBody = await response.text();
    }
  } catch (error) {
    responseBody = null;
  }

  if (!response.ok) {
    const message = responseBody && responseBody.message
      ? responseBody.message
      : `${method} ${url} failed with status ${response.status}`;

    throw new Error(message);
  }

  return responseBody || {};
};

/**
 * Safe GET request
 */
export async function makeGetRequest(endpoint) {
  const url = buildURL(endpoint);
  const headers = { ...defaultHeaders, ...getTokenHeader() };

  const response = await fetch(url, {
    method: 'GET',
    headers
  });

  return parseResponse(response, 'GET', url);
}

/**
 * Safe POST request
 */
export async function makePostRequest(endpoint, body = {}, method = 'POST') {
  const url = buildURL(endpoint);
  const headers = { ...defaultHeaders, ...getTokenHeader() };

  const response = await fetch(url, {
    method,
    headers,
    body: JSON.stringify(body)
  });

  return parseResponse(response, method, url);
}

/**
 * Safe PUT request
 */
export async function makePutRequest(endpoint, body = {}) {
  return makePostRequest(endpoint, body, 'PUT');
}

/**
 * Safe DELETE request
 */
export async function makeDeleteRequest(endpoint) {
  const url = buildURL(endpoint);
  const headers = { ...defaultHeaders, ...getTokenHeader() };

  const response = await fetch(url, {
    method: 'DELETE',
    headers
  });

  return parseResponse(response, 'DELETE', url);
}
