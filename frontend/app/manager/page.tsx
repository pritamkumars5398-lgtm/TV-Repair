import { redirect } from 'next/navigation';

export default function ManagerRootPage() {
  redirect('/admin/dashboard');
}
