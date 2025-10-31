import { verifySessionCookie } from '../services/authService.js';

export async function protect(req, res, next) {
  const sessionCookie = req.cookies.session || '';

  try {
    const decodedClaims = await verifySessionCookie(sessionCookie);
    if (decodedClaims) {
      req.user = decodedClaims;
      return next();
    }
    res.status(401).send({ error: 'Unauthorized' });
  } catch (error) {
    res.status(401).send({ error: 'Unauthorized' });
  }
}
