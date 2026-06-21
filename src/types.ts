export interface Recommendation {
  id: string;
  title: string;
  description: string;
  confidence: number;
  severity: "high" | "medium" | "low";
  source: string;
  estDuration: string;
  primaryAction: string;
  secondaryAction: string;
  limitation?: string;
  sources?: string[];
  isExecuted?: boolean;
  isDismissed?: boolean;
  isEscalated?: boolean;
  escalatedTo?: string;
  isOverridden?: boolean;
  overrideDetails?: {
    command: string;
    reason: string;
  };
  influencingFactors?: string[];
  alternatives?: Array<{
    id: string;
    title: string;
    confidence: number;
    description: string;
    justification: string;
    source: string;
    estDuration: string;
  }>;
}

export interface ReasoningChain {
  patternMatch: string;
  causalAttribution: string;
  impactPrediction: string;
  confidenceFactors: string[];
  executionSteps: string[];
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  event: string;
  source: string;
  severity: "high" | "medium" | "low" | "info";
  category: string;
}

export interface DeviceStatus {
  id: string;
  name: string;
  status: "online" | "offline" | "quarantined" | "maintenance";
  region: string;
  cpu: number;
  memory: number;
  uptime: number;
  lastPing: string;
}

export interface AIIncidentCard {
  incidentId: string;
  timestamp: string;
  unintendedOutcome: string;
  rootCause: string;
  failedSafeguard: string;
  preventativeMeasures: string[];
}
