// Invoice cannot be refunded twice (must check status)
async function refund(invoiceId, amount) {
  // FLAW-7: no idempotency/status guard, no amount validation
  await provider.refund(invoiceId, amount);
  await db.query('UPDATE invoices SET status = $1 WHERE id = $2', ['refunded', invoiceId]);
}
module.exports = { refund };
