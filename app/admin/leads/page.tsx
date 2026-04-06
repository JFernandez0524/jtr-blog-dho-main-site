"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import type { Schema } from "@/amplify/data/resource";

Amplify.configure(outputs);

type ContactSubmission = Schema["ContactSubmission"]["type"];

export default function AdminLeadsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState<string | null>(null);

  const client = generateClient<Schema>();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function fetchSubmissions() {
    try {
      const { data } = await client.models.ContactSubmission.list();
      setSubmissions(data.sort((a, b) => 
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      ));
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    } finally {
      setLoading(false);
    }
  }

  async function retrySync(submissionId: string) {
    setRetrying(submissionId);
    try {
      const response = await fetch("/api/admin/retry-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId }),
      });
      if (response.ok) await fetchSubmissions();
    } catch (error) {
      console.error("Retry failed:", error);
    } finally {
      setRetrying(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-remax-blue">Loading submissions...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-remax-blue mb-2">Lead Management</h1>
          <p className="text-remax-slate">
            Total Submissions: {submissions.length}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-remax-slate/10">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {submissions.filter((s) => s.ghlSyncStatus === "SYNCED").length}
            </div>
            <div className="text-sm text-remax-slate">Synced to GHL</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-remax-slate/10">
            <div className="text-3xl font-bold text-yellow-600 mb-1">
              {submissions.filter((s) => s.ghlSyncStatus === "PENDING").length}
            </div>
            <div className="text-sm text-remax-slate">Pending Sync</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-remax-slate/10">
            <div className="text-3xl font-bold text-red-600 mb-1">
              {submissions.filter((s) => s.ghlSyncStatus === "FAILED").length}
            </div>
            <div className="text-sm text-remax-slate">Failed Sync</div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-lg border border-remax-slate/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-remax-slate/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-remax-slate uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-remax-slate uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-remax-slate uppercase">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-remax-slate uppercase">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-remax-slate uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-remax-slate uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-remax-slate/10">
                {submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-remax-slate/5">
                    <td className="px-6 py-4 text-sm text-remax-slate">
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-remax-blue">
                      {submission.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-remax-slate">
                      <div>{submission.email}</div>
                      <div className="text-xs">{submission.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-remax-slate">
                      {submission.serviceType}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          submission.ghlSyncStatus === "SYNCED"
                            ? "bg-green-100 text-green-800"
                            : submission.ghlSyncStatus === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {submission.ghlSyncStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {submission.ghlSyncStatus === "FAILED" && (
                        <button
                          onClick={() => retrySync(submission.id)}
                          disabled={retrying === submission.id}
                          className="text-remax-blue hover:underline disabled:opacity-50"
                        >
                          {retrying === submission.id ? "Retrying..." : "Retry Sync"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
