
import admin from 'firebase-admin';

export async function createUser(email, password) {
  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });
    return userRecord;
  } catch (error) {
    console.error('Error creating new user:', error);
    throw error;
  }
}

export async function createSessionCookie(idToken) {
  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  try {
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
    return sessionCookie;
  } catch (error) {
    console.error('Error creating session cookie:', error);
    throw error;
  }
}

export async function verifySessionCookie(sessionCookie) {
  try {
    const decodedClaims = await admin.auth().verifySessionCookie(
      sessionCookie, true /** checkRevoked */);
    return decodedClaims;
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    return null;
  }
}

export async function getUserById(uid) {
    try {
        const userRecord = await admin.auth().getUser(uid);
        return userRecord;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}
