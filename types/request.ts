export type RequestStatus = 'pending' | 'in_review' | 'assigned' | 'in_progress' | 'resolved' | 'closed' | 'cancelled';

export type RequestPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ServiceRequest {
  id: string;
  ticketNumber: string;
  category: string;
  appliance: string;
  brand?: string;
  issueDescription: string;
  priority: RequestPriority;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  scheduledDate?: string;
  assignedTechnician?: string;
  estimatedCost?: number;
  updates?: {
    id: string;
    timestamp: string;
    title: string;
    description: string;
  }[];
}
