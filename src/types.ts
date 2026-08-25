export interface DnsRecord {
  type: 'A' | 'AAAA' | 'CNAME' | 'TXT';
  host: string;
  value: string;
  ttl: string;
  purpose: string;
  recommended?: boolean;
}

export interface RegistrarStep {
  stepNumber: number;
  title: string;
  description: string;
  actionTip?: string;
}

export interface RegistrarGuideItem {
  id: string;
  name: string;
  logoIcon: string;
  popularIn: string;
  instructions: RegistrarStep[];
  directDnsUrl?: string;
  notes?: string;
}

export interface PropertyProject {
  id: string;
  title: string;
  tagline: string;
  category: 'Villa Plots' | 'Gated Community' | 'Commercial' | 'Farmlands';
  location: string;
  pricePerSqYd: string;
  totalPlots: number;
  availablePlots: number;
  approvals: string[];
  features: string[];
  image: string;
  highlight: string;
  sizeRange: string;
  reraNumber: string;
  launchYear: string;
}

export interface DailyUpdate {
  id: string;
  title: string;
  date: string;
  category: 'Road Laying' | 'Entrance Arch' | 'Water Tank' | 'Plantation' | 'Electricity & Lights' | 'Spot Registration' | 'Site Visit' | 'Other';
  projectTitle: string;
  description: string;
  imageUrl: string;
  author?: string;
}

export interface DnsCheckResult {
  provider: string;
  status: 'SUCCESS' | 'ERROR' | 'PENDING' | 'WARNING';
  recordsFound: {
    type: string;
    data: string;
    ttl: number;
  }[];
  isGithubConfigured: boolean;
  notes: string[];
  latencyMs?: number;
}
