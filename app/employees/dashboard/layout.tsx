
import React, { Suspense } from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Provider from '@/app/_components/Provider';
import NavbarEmployee from '@/app/_components/employees/NavbarEmployee';

export default async function DashboardEmployeeLayout({ children }: { children: React.ReactNode }) {
  const session: any = await getServerSession(authOptions);
  return (
    <>
      <div className="w-screen">
        <NavbarEmployee session={session} />
      </div>
      <section className="container mx-auto">
        <Provider session={session}>
          <Suspense fallback={<h1>Loading...</h1>}>{children}</Suspense>
        </Provider>
      </section>
    </>
  );
}
