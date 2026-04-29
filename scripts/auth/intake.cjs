/**
 * portfolio-sync custom auth — Intake (INSEAD)
 * Kiosque 2 étapes : clic sur la carte "IT Administrator" → input password → bouton "Sign in".
 * Loaded by portfolio-sync as: (page, { projectUrl, env }) => Promise<void>
 */
module.exports = async (page, { env }) => {
  const password = env.INTAKE_PASSWORD;
  if (!password) throw new Error('INTAKE_PASSWORD missing in environment (.env)');

  await page.waitForFunction(
    () => Array.from(document.querySelectorAll('button')).some(b => /IT Administrator/i.test(b.textContent || '')),
    { timeout: 10000 }
  );
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => /IT Administrator/i.test(b.textContent || ''));
    btn.click();
  });

  await page.waitForSelector('#password-input', { timeout: 10000 });
  await page.type('#password-input', password);

  await page.waitForFunction(
    () => Array.from(document.querySelectorAll('button')).some(b => (b.textContent || '').trim() === 'Sign in'),
    { timeout: 5000 }
  );
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => (b.textContent || '').trim() === 'Sign in');
    btn.click();
  });

  // Block until NextAuth redirect lands somewhere other than /auth/signin
  await page.waitForFunction(
    () => !location.pathname.startsWith('/auth/signin'),
    { timeout: 15000 }
  );
};
