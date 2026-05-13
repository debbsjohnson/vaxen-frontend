'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/theme-context';
import { Menu, X } from 'lucide-react';
import { clearClientAuthState, getStoredCsrfToken } from '@/lib/auth-state';
import { vaxenApi } from '@/lib/vaxen-api';
import { RequestAccessModal } from './request-access-modal';

export function LandingNavbar() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('auth');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch('/api/auth/status', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });

        if (!response.ok) {
          setIsLoggedIn(false);
          return;
        }

        const data = (await response.json()) as { loggedIn?: boolean };
        setIsLoggedIn(Boolean(data.loggedIn));
      } catch {
        setIsLoggedIn(false);
      }
    })();
  }, []);

  const handleLogout = async () => {
    try {
      await vaxenApi.auth.logout({ csrfToken: getStoredCsrfToken() });
    } catch {
      // Clear local state even if backend logout fails.
    } finally {
      clearClientAuthState();
      setIsLoggedIn(false);
      router.push(`/${locale}/landing`);
      router.refresh();
    }
  };

  const navItems = [
    { label: 'Product', href: '#product' },
    { label: "Who It's For", href: '#who-its-for' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Security', href: '#security' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 pt-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div 
            className="flex items-center justify-between h-14 px-6 rounded-full"
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
            }}
          >
            {/* Logo */}
            <Link href={`/${locale}/landing`} className="flex items-center">
              <Image
                src={theme === 'dark' ? '/assets/logo/VAXEN white.png' : '/assets/logo/VAXEN Navy.png'}
                alt="Vaxen Global"
                width={120}
                height={35}
                className="object-contain"
                priority
                unoptimized
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Right side actions */}
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  <Link
                    href={`/${locale}/dashboard`}
                    className="px-5 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {t('logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={`/${locale}/login`}
                    className="px-5 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {t('login')}
                  </Link>
                  <button
                    onClick={() => {
                      setIsModalOpen(true);
                      if (typeof window !== 'undefined' && (window as any).gtag) {
                        (window as any).gtag('event', 'cta_click_request_access', {
                          event_category: 'lead_generation',
                          event_label: 'navbar',
                        });
                      }
                    }}
                    className="px-6 py-2.5 rounded-full text-sm font-medium text-white transition-all hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, rgba(12, 37, 115, 0.25) 0%, rgba(186, 8, 39, 0.25) 100%)',
                      backdropFilter: 'blur(30px) saturate(200%)',
                      WebkitBackdropFilter: 'blur(30px) saturate(200%)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 8px 32px rgba(12, 37, 115, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    Request Access
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-foreground"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div 
            className="md:hidden mt-2 rounded-2xl"
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
            }}
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </a>
              ))}
              {!isLoggedIn ? (
                <>
                  <Link
                    href={`/${locale}/login`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {t('login')}
                  </Link>
                  <button
                    onClick={() => {
                      setIsModalOpen(true);
                      setIsMenuOpen(false);
                      if (typeof window !== 'undefined' && (window as any).gtag) {
                        (window as any).gtag('event', 'cta_click_request_access', {
                          event_category: 'lead_generation',
                          event_label: 'mobile_navbar',
                        });
                      }
                    }}
                    className="w-full mt-2 px-6 py-2.5 rounded-full text-white font-medium transition-all hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, rgba(12, 37, 115, 0.25) 0%, rgba(186, 8, 39, 0.25) 100%)',
                      backdropFilter: 'blur(30px) saturate(200%)',
                      WebkitBackdropFilter: 'blur(30px) saturate(200%)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 8px 32px rgba(12, 37, 115, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    Request Access
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={`/${locale}/dashboard`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      void handleLogout();
                    }}
                    className="w-full mt-2 px-6 py-2.5 rounded-full text-white font-medium transition-all hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, rgba(12, 37, 115, 0.25) 0%, rgba(186, 8, 39, 0.25) 100%)',
                      backdropFilter: 'blur(30px) saturate(200%)',
                      WebkitBackdropFilter: 'blur(30px) saturate(200%)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 8px 32px rgba(12, 37, 115, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {t('logout')}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <RequestAccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

