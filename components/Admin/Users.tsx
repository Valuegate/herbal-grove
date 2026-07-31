import UsersTable from "@/components/Admin/users/CreateUserForm";

export default function UsersPage() {
  return (
    <main className="p-8">

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Users
          </h1>

          <p className="text-gray-500">
            Invite consultants and researchers.
          </p>
        </div>

      </div>

      <UsersTable />

    </main>
  );
}