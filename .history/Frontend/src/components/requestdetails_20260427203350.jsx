import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock3, MapPin, Trash2, BadgeAlert, ShieldCheck } from "lucide-react";

function formatDate(value) {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function readJsonSafely(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return { message: text || "Unexpected server response" };
  }
}

function StatusPill({ status }) {
  const isCompleted = status === "Completed";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border ${
        isCompleted
          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
          : "bg-amber-500/10 text-amber-300 border-amber-500/30"
      }`}
    >
      {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
      {status || "Pending"}
    </span>
  );
}

function DetailRow({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-sky-300/80">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className="text-sm sm:text-base text-white/90 leading-relaxed break-words">
        {value || "Not available"}
      </div>
    </div>
  );
}

function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("relief_token");
  const dashboardPath = (() => {
    try {
      const rawUser = localStorage.getItem("relief_user");
      const user = rawUser ? JSON.parse(rawUser) : null;
      return user?.role === "volunteer" ? "/dashboard" : "/user-dashboard";
    } catch {
      return "/dashboard";
    }
  })();

  const [requestData, setRequestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const badgeTone = useMemo(() => {
    if (requestData?.status === "Completed") return "completed";
    return "pending";
  }, [requestData?.status]);

  useEffect(() => {
    const fetchRequest = async () => {
      if (!id) {
        setError("Request ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/relief/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await readJsonSafely(response);

        if (!response.ok) {
          throw new Error(data.message || "Unable to fetch request details");
        }

        setRequestData(data.relief);
      } catch (fetchError) {
        const message = (fetchError.message || "Something went wrong").includes("<!DOCTYPE")
          ? "Backend route not responding. Restart the server and try again."
          : fetchError.message || "Something went wrong";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id, token]);

  const handleMarkCompleted = async () => {
    if (!requestData || requestData.status === "Completed") return;

    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`http://localhost:5000/api/relief/update/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await readJsonSafely(response);

      if (!response.ok) {
        throw new Error(data.message || "Unable to update request");
      }

      setRequestData(data.relief);
      setSuccess("Request marked as completed.");
    } catch (updateError) {
      const message = (updateError.message || "Something went wrong").includes("<!DOCTYPE")
        ? "Backend route not responding. Restart the server and try again."
        : updateError.message || "Something went wrong";
      setError(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this relief request permanently?");
    if (!confirmed) return;

    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`http://localhost:5000/api/relief/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await readJsonSafely(response);

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete request");
      }

      navigate(dashboardPath, { replace: true });
    } catch (deleteError) {
      const message = (deleteError.message || "Something went wrong").includes("<!DOCTYPE")
        ? "Backend route not responding. Restart the server and try again."
        : deleteError.message || "Something went wrong";
      setError(message);
    } finally {
      setActionLoading(false);
    }
  };

  if (!token) {
    navigate("/login", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-[#050511] text-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <button
            type="button"
            onClick={() => navigate(dashboardPath)}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200 transition-all hover:bg-white/10 hover:border-purple-400/30"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </button>

                      onClick={() => navigate(dashboardPath)}
            <ShieldCheck className="h-4 w-4" />
            Relief Request Details
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.20),transparent_28%),radial-gradient(circle_at_top_right,rgba(37,99,235,0.18),transparent_30%),rgba(10,10,20,0.92)] p-5 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
          {loading ? (
            <div className="flex min-h-[60vh] items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/5 text-gray-300">
              Loading request details...
            </div>
          ) : error ? (
            <div className="rounded-[1.5rem] border border-red-500/25 bg-red-500/10 p-6 text-red-100">
              {error}
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="space-y-6">
                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="mb-2 text-xs uppercase tracking-[0.28em] text-purple-300/80">Request Overview</p>
                      <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                        {requestData?.title || "Request Details"}
                      </h1>
                    </div>
                    <StatusPill status={requestData?.status} />
                  </div>

                  <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-300 sm:text-base">
                    {requestData?.description || "No description provided for this request."}
                  </p>

                  {success && (
                    <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                      {success}
                    </div>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <DetailRow icon={MapPin} label="Location" value={requestData?.location} />
                  <DetailRow
                    icon={BadgeAlert}
                    label="Priority"
                    value={requestData?.priority}
                  />
                  <DetailRow
                    icon={Clock3}
                    label="Created Date"
                    value={formatDate(requestData?.createdAt)}
                  />
                  <DetailRow
                    icon={ShieldCheck}
                    label="Status"
                    value={requestData?.status || "Pending"}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 sm:p-7">
                  <p className="text-xs uppercase tracking-[0.28em] text-sky-200/80">Actions</p>
                  <div className="mt-4 space-y-3">
                    <button
                      type="button"
                      onClick={handleMarkCompleted}
                      disabled={actionLoading || requestData?.status === "Completed"}
                      className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Mark as Completed
                    </button>

                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={actionLoading}
                      className="w-full rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3.5 text-sm font-semibold text-red-200 transition-all hover:bg-red-500/15 hover:border-red-400/30 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span className="inline-flex items-center justify-center gap-2">
                        <Trash2 className="h-4 w-4" />
                        Delete Request
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/dashboard")}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-semibold text-gray-200 transition-all hover:bg-white/10 hover:border-purple-400/30"
                    >
                      Back
                    </button>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 sm:p-7">
                  <p className="text-xs uppercase tracking-[0.28em] text-sky-200/80">Details</p>
                  <div className="mt-4 space-y-4 text-sm text-gray-300">
                    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                      <span className="text-gray-400">Request ID</span>
                      <span className="break-all text-right text-white/90">{requestData?._id}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                      <span className="text-gray-400">Created At</span>
                      <span className="text-right text-white/90">{formatDate(requestData?.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-400">Priority Color</span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${requestData?.priority === "High" ? "bg-red-500/15 text-red-200" : requestData?.priority === "Medium" ? "bg-amber-500/15 text-amber-200" : "bg-sky-500/15 text-sky-200"}`}>
                        {requestData?.priority || "Medium"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RequestDetails;