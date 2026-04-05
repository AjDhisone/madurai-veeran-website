"use client";

import { useEffect, useRef } from 'react';

type TurnstileTheme = 'light' | 'dark' | 'auto';

type TurnstileWidgetProps = {
  onTokenChange: (token: string) => void;
  className?: string;
  theme?: TurnstileTheme;
};

type TurnstileRenderOptions = {
  sitekey: string;
  theme?: TurnstileTheme;
  callback: (token: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?: () => void;
};

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

export default function TurnstileWidget({
  onTokenChange,
  className,
  theme = 'auto',
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) {
      onTokenChange('');
      return;
    }

    let cancelled = false;
    let widgetId: string | undefined;
    let pollId: ReturnType<typeof setInterval> | undefined;

    const mountWidget = () => {
      if (cancelled || !containerRef.current || !window.turnstile) {
        return;
      }

      onTokenChange('');
      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme,
        callback: (token) => onTokenChange(token),
        'expired-callback': () => onTokenChange(''),
        'error-callback': () => onTokenChange(''),
      });
    };

    if (window.turnstile) {
      mountWidget();
    } else {
      let attempts = 0;
      pollId = setInterval(() => {
        attempts += 1;
        if (window.turnstile) {
          clearInterval(pollId);
          mountWidget();
          return;
        }

        if (attempts >= 60) {
          clearInterval(pollId);
        }
      }, 150);
    }

    return () => {
      cancelled = true;
      if (pollId) {
        clearInterval(pollId);
      }

      if (widgetId && window.turnstile) {
        window.turnstile.remove(widgetId);
      }
    };
  }, [onTokenChange, theme]);

  if (!TURNSTILE_SITE_KEY) {
    return null;
  }

  return (
    <div className={className}>
      <div ref={containerRef} />
    </div>
  );
}
