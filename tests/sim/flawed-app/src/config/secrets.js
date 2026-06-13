// Planted-flaw config — exercises secret-scan pattern classes that previously
// had only regex-validity probes (FLAW-11..FLAW-13). Intentionally insecure.
module.exports = {
  // FLAW-11: hardcoded AWS access key id (cloud-keys class)
  awsAccessKeyId: 'AKIAIOSFODNN7EXAMPLE',
  // FLAW-12: postgres connection string with embedded credentials (DB-URL class)
  databaseUrl: 'postgres://admin:s3cr3tP@ss@db.internal:5432/app',
  // FLAW-13: inline RSA private key header (private-keys class)
  signingKeyPem: '-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA-fake-do-not-use\n-----END RSA PRIVATE KEY-----',
};
