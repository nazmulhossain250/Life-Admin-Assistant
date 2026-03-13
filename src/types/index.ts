export interface AnalysisResult {
  simplifiedText: string;
  deadline: string | null;
  checklist: string[];
  draftReply: string | null;
  documentType: string;
  diseaseManagement?: string;
  lifestyleMaintenance?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
