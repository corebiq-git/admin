export type ComplianceItem = {
  name: string;
  status: string;
  dueDate?: string;
  details?: string;
};

export type ClientDownload = {
  fileName: string;
  storagePath: string;
  category?: string;
  uploadedAt?: string;
};

export type ClientProfile = {
  id: string;
  clientName?: string;
  clientMobile?: string;
  clientEmail?: string;
  compliance: ComplianceItem[];
  downloads: ClientDownload[];
};
