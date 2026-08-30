import { useState, useEffect } from 'react';
import { ServiceRequest } from '../types/request';
import { mockRequests } from '../data/requests';

export function useRequests() {
  const [requests, setRequests] = useState<ServiceRequest[]>(mockRequests);
  const [loading, setLoading] = useState<boolean>(false);

  const getRequestById = (id: string) => {
    return requests.find((r) => r.id === id || r.ticketNumber === id);
  };

  const addRequest = (newRequest: Partial<ServiceRequest>) => {
    const created: ServiceRequest = {
      id: 'REQ-' + Math.floor(1000 + Math.random() * 9000),
      ticketNumber: 'TKT-2026-' + Math.floor(1000 + Math.random() * 9000),
      category: newRequest.category || 'General',
      appliance: newRequest.appliance || 'Appliance',
      brand: newRequest.brand || 'Generic',
      issueDescription: newRequest.issueDescription || '',
      priority: newRequest.priority || 'medium',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...newRequest,
    };
    setRequests((prev) => [created, ...prev]);
    return created;
  };

  const cancelRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' as const } : r))
    );
  };

  return {
    requests,
    loading,
    getRequestById,
    addRequest,
    cancelRequest,
  };
}

export default useRequests;
