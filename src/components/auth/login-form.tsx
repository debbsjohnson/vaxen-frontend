'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ToastStack } from '@/components/shared/toast-stack';
import { setClientAuthState } from '@/lib/auth-state';
import { vaxenApi } from '@/lib/vaxen-api';
import { useToastStack } from '@/lib/use-toast-stack';
import { Button } from '@/ui';
import { Input } from '@/ui';
import { Label } from '@/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  mfaCode: z.string().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('auth');
  const { toasts, addToast, removeToast } = useToastStack();
  const [apiError, setApiError] = useState('');
  const [apiMessage, setApiMessage] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setApiError('');
    setApiMessage('');

    try {
      const response = await vaxenApi.auth.login(data);

      if ('requiresMfa' in response.data && response.data.requiresMfa && 'challengeId' in response.data) {
        const message = 'MFA required. Enter your MFA code and submit again.';
        setApiMessage(message);
        addToast('success', message);
        return;
      }

      const message = 'Login successful. Redirecting...';
      setApiMessage(message);
      addToast('success', message);

      if (!('requiresMfa' in response.data)) {
        setClientAuthState({
          csrfToken: response.data.csrfToken,
          user: response.data.user,
        });
      }

      router.replace(`/${locale}/dashboard`);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed. Please try again.';
      setApiError(message);
      addToast('error', message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('login')}</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {apiError && <p className="text-sm text-destructive">{apiError}</p>}
          {apiMessage && <p className="text-sm text-green-600">{apiMessage}</p>}

          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mfaCode">{t('mfaCode')}</Label>
            <Input
              id="mfaCode"
              type="text"
              {...register('mfaCode')}
              placeholder="123456"
              maxLength={6}
            />
            {errors.mfaCode && (
              <p className="text-sm text-destructive">{errors.mfaCode.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t('loading') : t('login')}
          </Button>
        </form>
      </CardContent>
      <ToastStack toasts={toasts} onDismiss={removeToast} />
    </Card>
  );
}
