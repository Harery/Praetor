const jwt = require('jsonwebtoken');
// FLAW-9: JWT secret falls back to a hardcoded dev value via ||
const SIGNING_KEY = process.env.JWT_SECRET || 'dev-secret-fallback';
// FLAW-10: same class via nullish coalescing — patterns catching only || miss this
const VERIFY_KEY = process.env.JWT_SECRET ?? 'dev-secret-fallback';
function issueToken(userId) {
  return jwt.sign({ id: userId }, SIGNING_KEY, { expiresIn: '15m' });
}
function verifyToken(token) {
  return jwt.verify(token, VERIFY_KEY);
}
module.exports = { issueToken, verifyToken };
