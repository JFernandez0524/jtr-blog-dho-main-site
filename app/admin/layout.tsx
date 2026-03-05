import { AuthGetCurrentUserServer } from "@/utils/amplify-utils";
import Logout from "@/components/Logout";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await AuthGetCurrentUserServer();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-remax-blue">Admin Panel</h1>
            <p className="text-sm text-gray-600">
              Logged in as: {user?.signInDetails?.loginId || user?.userId}
            </p>
          </div>
          <Logout />
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
