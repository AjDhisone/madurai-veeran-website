const SUBMIT_LOG_PREFIX = 'form-submit-log:';

export function isLikelyBotSubmission(startedAtMs: number, honeypotValue: string) {
  const elapsedMs = Date.now() - startedAtMs;
  return honeypotValue.trim().length > 0 || elapsedMs < 1500;
}

export function isClientRateLimited(formType: string, windowMs = 5 * 60 * 1000, maxHits = 3) {
  if (typeof window === 'undefined') {
    return false;
  }

  const storageKey = `${SUBMIT_LOG_PREFIX}${formType}`;
  const now = Date.now();

  try {
    const raw = window.localStorage.getItem(storageKey);
    const parsed = raw ? (JSON.parse(raw) as number[]) : [];
    const recent = parsed.filter((timestamp) => now - timestamp < windowMs);

    return recent.length >= maxHits;
  } catch {
    return false;
  }
}

export function markClientSubmission(formType: string) {
  if (typeof window === 'undefined') {
    return;
  }

  const storageKey = `${SUBMIT_LOG_PREFIX}${formType}`;
  const now = Date.now();

  try {
    const raw = window.localStorage.getItem(storageKey);
    const parsed = raw ? (JSON.parse(raw) as number[]) : [];
    const recent = parsed.filter((timestamp) => now - timestamp < 5 * 60 * 1000);
    recent.push(now);
    window.localStorage.setItem(storageKey, JSON.stringify(recent));
  } catch {
    // Ignore storage write issues.
  }
}
