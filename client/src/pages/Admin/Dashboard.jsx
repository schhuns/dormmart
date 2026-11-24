import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Users,
  ShoppingBag,
  AlertTriangle,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Trash2,
  Activity,
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "overview") {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } else if (activeTab === "users") {
        const res = await api.get("/admin/users");
        setUsers(res.data || []);
      } else if (activeTab === "reports") {
        const res = await api.get("/admin/reports");
        setReports(res.data || []);
      } else if (activeTab === "logs") {
        const res = await api.get("/admin/logs");
        setLogs(res.data || []);
      }
    } catch (err) {
      console.error("Admin data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    if (!window.confirm(`Are you sure you want to set this user to ${newStatus}?`)) return;

    try {
      await api.patch(`/admin/users/${userId}/status`, { status: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, accountStatus: newStatus } : u))
      );
    } catch (err) {
      alert("Failed to update user status.");
    }
  };

  const handleUpdateReport = async (reportId, newStatus) => {
    try {
      await api.patch(`/admin/reports/${reportId}`, { status: newStatus });
      setReports((prev) =>
        prev.map((r) => (r._id === reportId ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      alert("Failed to update report status.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Administration Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage marketplace accounts, moderate listings, review reports, and view audit activity
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: "overview", label: "Overview Metrics" },
          { id: "users", label: "User Management" },
          { id: "reports", label: "Report Queue" },
          { id: "logs", label: "Audit Logs" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? "bg-brand-navy text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500">Loading admin data...</p>
        </div>
      ) : activeTab === "overview" && stats ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-xs text-slate-400 font-semibold uppercase block">Total Users</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{stats.totalUsers}</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-xs text-slate-400 font-semibold uppercase block">Total Listings</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{stats.totalListings}</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-xs text-slate-400 font-semibold uppercase block">Available</span>
            <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">{stats.availableListings}</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-xs text-slate-400 font-semibold uppercase block">Sold Items</span>
            <span className="text-2xl font-extrabold text-slate-700 mt-1 block">{stats.soldListings}</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-xs text-slate-400 font-semibold uppercase block">Pending Reports</span>
            <span className="text-2xl font-extrabold text-rose-600 mt-1 block">{stats.pendingReports}</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-xs text-slate-400 font-semibold uppercase block">Suspended</span>
            <span className="text-2xl font-extrabold text-amber-600 mt-1 block">{stats.suspendedUsers}</span>
          </div>
        </div>
      ) : activeTab === "users" ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-900 flex items-center gap-3">
                    <img
                      src={u.profileImage || "/uploads/avatar.png"}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span>{u.fullName}</span>
                  </td>
                  <td className="p-4 text-slate-600">{u.email}</td>
                  <td className="p-4 font-medium">{u.role}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold ${
                        u.accountStatus === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {u.accountStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggleUserStatus(u._id, u.accountStatus)}
                      className={`text-xs font-semibold px-3 py-1 rounded-lg ${
                        u.accountStatus === "ACTIVE"
                          ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                          : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                      }`}
                    >
                      {u.accountStatus === "ACTIVE" ? "Suspend" : "Reactivate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : activeTab === "reports" ? (
        <div className="space-y-4">
          {reports.length > 0 ? (
            reports.map((r) => (
              <div key={r._id} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700">
                    {r.reason}
                  </span>
                  <p className="text-sm font-semibold text-slate-900 mt-2">{r.description || "No additional description"}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Reported on {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateReport(r._id, "Resolved")}
                    className="text-xs font-semibold bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700"
                  >
                    Resolve
                  </button>
                  <button
                    onClick={() => handleUpdateReport(r._id, "Rejected")}
                    className="text-xs font-semibold bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-300"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-slate-500 py-12">No reports in queue.</p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 text-xs">
          {logs.map((log) => (
            <div key={log._id} className="p-4 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">{log.action}</span>
                <span className="text-slate-500 ml-2">{log.details}</span>
              </div>
              <span className="text-slate-400">{new Date(log.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
