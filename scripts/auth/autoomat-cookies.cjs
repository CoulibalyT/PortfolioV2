/**
 * portfolio-sync custom "auth" hook — Autoomat
 * Not a login: dismisses the cookie-consent banner ("Refuser") before the captures,
 * so it doesn't cover the bottom of every screenshot. The choice is persisted by the
 * site, and portfolio-sync reuses the same page for all the project's captures.
 * Loaded by portfolio-sync as: (page, { projectUrl, env }) => Promise<void>
 */
module.exports = async (page) => {
  const hasRefuseButton = () =>
    Array.from(document.querySelectorAll('button')).some(b => (b.textContent || '').trim() === 'Refuser');

  try {
    await page.waitForFunction(hasRefuseButton, { timeout: 8000 });
  } catch {
    // No banner (already dismissed or removed from the site): nothing to do.
    return;
  }

  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => (b.textContent || '').trim() === 'Refuser');
    btn.click();
  });

  // Block until the banner is gone
  await page.waitForFunction(
    () => !Array.from(document.querySelectorAll('button')).some(b => (b.textContent || '').trim() === 'Refuser'),
    { timeout: 5000 }
  );
};
