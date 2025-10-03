// src/types/export.ts

export type RapportSize = 20 | 25;

export interface ExportSettings {
  rapportCm: RapportSize;
  dpi: number;
  format: "PNG" | "PNG+SVG";
  includeMetadata: boolean;
}

export interface ExportHistoryItem {
  id: string;
  imageUrl: string;
  downloadUrl: string;
  fileName: string;
  fileSize: number;
  settings: ExportSettings;
  editorSettings: {
    repeat: string;
    symmetry: string;
    density: number;
    thickness: number;
  };
  timestamp: string;
  status: "success" | "failed";
}

export interface ExportResponse {
  success: boolean;
  downloadUrl: string;
  zipKey: string;
  metadata: {
    fileName: string;
    fileSize: number;
    rapport_cm: number;
    resolution: string;
    dpi: number;
  };
  message: string;
}
