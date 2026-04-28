import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";
export default function AdminDashboard() {
  const [pending, setPending] = useState([]);

  const loadData = async () => {
    const res = await apiRequest("/admin/identities/pending");
    setPending(res.data);
  };

  useEffect(() => { loadData(); }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      await apiRequest(`/admin/identities/${id}/${action}`, { 
        method: "PATCH", 
        body: action === 'reject' ? { reason: "Document non conforme" } : {} 
      });
      loadData();
    } catch (err) { alert("Erreur d'action"); }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-8">Validations en attente</h1>
      <div className="grid gap-6">
        {pending.map((user: any) => (
          <div key={user.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={user.idPhotoUrl} className="w-20 h-20 object-cover rounded-lg border" alt="ID" />
              <div>
                <h3 className="font-bold text-lg">{user.fullName}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-400">Né le {new Date(user.dateOfBirth).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleAction(user.id, 'reject')} className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50">Rejeter</button>
              <button onClick={() => handleAction(user.id, 'approve')} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Approuver</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}