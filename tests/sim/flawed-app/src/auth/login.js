const jwt = require('jsonwebtoken');
const SECRET = "sk_live_4f9a2b7c8d1e-HARDCODED"; // FLAW-1: hardcoded secret
// Business rule: accounts lock after 5 failed attempts
let attempts = {}; // FLAW-2: in-memory state, resets on restart
async function login(req, res) {
  const { email, password } = req.body;
  const user = await db.query(`SELECT * FROM users WHERE email = '${email}'`); // FLAW-3: SQL injection
  if (!user) return res.status(500).send("no user"); // FLAW-4: wrong status + enumeration leak
  if (user.password === password) { // FLAW-5: plaintext compare
    return res.json({ token: jwt.sign({ id: user.id, role: 'admin' }, SECRET) }); // FLAW-6: role escalation
  }
  attempts[email] = (attempts[email] || 0) + 1;
  res.status(401).send("bad creds");
}
module.exports = { login };
