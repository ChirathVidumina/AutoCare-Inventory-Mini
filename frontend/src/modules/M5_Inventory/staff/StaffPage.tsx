import { useState } from "react";
import { Plus, Search, ShieldCheck, UserCheck, UserPlus, Users } from "lucide-react";
import { mockStaff } from "./staffMockData";
import {
  formatJoinedDate,
  getInitials,
  isJoinedThisMonth,
} from "./staffTypes";
import type { StaffMember } from "./staffTypes";

// Filter dropdown එකට "All" + අගයන් (අනුපිළිවෙලින්, duplicate නැතිව)
function buildOptions(values: string[]): string[] {
  return ["All", ...Array.from(new Set(values))];
}

const selectClass =
  "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-700";

export default function StaffPage() {
  // state: staff list, search text, සහ filters 3
  const [staff] = useState<StaffMember[]>(mockStaff);
  const [searchText, setSearchText] = useState("");
  const [department, setDepartment] = useState("All");
  const [systemRole, setSystemRole] = useState("All");
  const [status, setStatus] = useState("All");

  // Summary card values (list එකෙන් ගණනය කරනවා)
  const totalStaff = staff.length;
  const activeCount = staff.filter((s) => s.status === "active").length;
  const inactiveCount = totalStaff - activeCount;
  const adminCount = staff.filter((s) => s.systemRole === "Administrator").length;
  const newThisMonth = staff.filter((s) => isJoinedThisMonth(s.joinedDate)).length;

  // Dropdown options
  const departmentOptions = buildOptions(staff.map((s) => s.department));
  const roleOptions = buildOptions(staff.map((s) => s.systemRole));

  // Search + filters එකට අනුව list එක පෙරනවා
  const keyword = searchText.trim().toLowerCase();
  const phoneKeyword = keyword.replace(/\s/g, "");
  const filteredStaff = staff.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(keyword) ||
      s.email.toLowerCase().includes(keyword) ||
      s.phone.replace(/\s/g, "").includes(phoneKeyword);
    const matchesDepartment = department === "All" || s.department === department;
    const matchesRole = systemRole === "All" || s.systemRole === systemRole;
    const matchesStatus = status === "All" || s.status === status;
    return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Staff Overview</h1>
          <p className="text-sm text-slate-500">
            Manage employees, their roles and system access
          </p>
        </div>
        {/* Add form එක ඊළඟ task එකේදී හදනවා */}
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-blue-900 px-5 py-3 text-sm font-medium text-white hover:bg-blue-800"
        >
          <Plus size={18} />
          Add New Employee
        </button>
      </div>

      {/* Summary cards */}
      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
          <div>
            <p className="text-sm text-slate-500">Total Staff</p>
            <p className="text-2xl font-semibold text-slate-900">{totalStaff}</p>
            <p className="text-xs text-slate-500">All employees</p>
          </div>
          <Users className="text-yellow-500" />
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
          <div>
            <p className="text-sm text-slate-500">Active Accounts</p>
            <p className="text-2xl font-semibold text-slate-900">{activeCount}</p>
            <p className="text-xs text-slate-500">{inactiveCount} inactive</p>
          </div>
          <UserCheck className="text-green-600" />
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
          <div>
            <p className="text-sm text-slate-500">Administrators</p>
            <p className="text-2xl font-semibold text-slate-900">{adminCount}</p>
            <p className="text-xs text-red-500">Full system access</p>
          </div>
          <ShieldCheck className="text-blue-700" />
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
          <div>
            <p className="text-sm text-slate-500">New This Month</p>
            <p className="text-2xl font-semibold text-slate-900">{newThisMonth}</p>
            <p className="text-xs text-slate-500">Joined this month</p>
          </div>
          <UserPlus className="text-yellow-500" />
        </div>
      </div>

      {/* Search + filters */}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <div className="relative min-w-64 flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search name, email or phone number"
            className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-700"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-500">
          Department
          <select
            className={selectClass}
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            {departmentOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-500">
          System role
          <select
            className={selectClass}
            value={systemRole}
            onChange={(e) => setSystemRole(e.target.value)}
          >
            {roleOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-500">
          Status
          <select
            className={selectClass}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
      </div>

      {/* Staff table */}
      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Staff ID</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Job Role</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">System Role</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Last Login</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((member) => (
              <tr key={member.id} className="border-t border-slate-200">
                <td className="px-4 py-4">{member.id}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${
                        member.systemRole === "Administrator"
                          ? "bg-yellow-400 text-slate-900"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {getInitials(member.name)}
                    </span>
                    <div>
                      <p className="font-medium text-slate-900">{member.name}</p>
                      <p className="text-xs text-blue-700">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">{member.jobRole}</td>
                <td className="px-4 py-4">{member.department}</td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      member.systemRole === "Administrator"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {member.systemRole}
                  </span>
                </td>
                <td className="px-4 py-4">{member.phone}</td>
                <td className="px-4 py-4">{formatJoinedDate(member.joinedDate)}</td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      member.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {member.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-4">{member.lastLogin}</td>
                <td className="px-4 py-4">
                  {/* View / Edit ඊළඟ task එකේදී ක්‍රියාත්මක කරනවා */}
                  <div className="flex items-center gap-2 text-blue-700">
                    <button type="button" className="hover:underline">
                      View
                    </button>
                    <span className="text-slate-300">·</span>
                    <button type="button" className="hover:underline">
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredStaff.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-slate-500">
                  No staff found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Showing {filteredStaff.length} out of {staff.length}
      </p>
    </div>
  );
}