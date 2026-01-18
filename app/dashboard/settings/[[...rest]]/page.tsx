'use client';

import { UserProfile } from '@clerk/nextjs';

const UserProfilePage = () => {
  return (
    <div className="min-h-screen space-y-8 bg-slate-50 p-6 lg:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
          <p className="text-slate-500">
            Manage your account details, security preferences, and organization settings.
          </p>
        </div>

        <div className="flex w-full items-center justify-center">
          <UserProfile
            path="/dashboard/settings"
            appearance={{
              elements: {
                rootBox: 'w-full shadow-none p-0',
                card: 'w-full shadow-sm border border-slate-200 rounded-xl bg-white',
                navbar: 'hidden md:flex border-r border-slate-200 bg-slate-50/50',
                navbarButton: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
                navbarButtonActive:
                  'text-slate-900 bg-white shadow-sm ring-1 ring-slate-200 font-medium',
                headerTitle: 'text-xl font-bold text-slate-900',
                headerSubtitle: 'text-slate-500',
                formButtonPrimary: 'bg-slate-900 hover:bg-slate-800 text-white',
                formButtonReset: 'text-slate-600 hover:bg-slate-100',
                footerActionLink: 'text-slate-900 hover:text-slate-700',
              },
              variables: {
                colorPrimary: '#0f172a', // slate-900
                colorText: '#0f172a',
                colorTextSecondary: '#64748b',
                fontFamily: 'inherit',
                borderRadius: '0.75rem',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
