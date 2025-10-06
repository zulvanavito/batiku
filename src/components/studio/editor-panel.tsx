"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Info } from "lucide-react"; // <-- 1. Import ikon Info

export type EditorSettings = {
  repeat: "square" | "half-drop";
  symmetry: "none" | "2-fold" | "4-fold" | "8-fold";
  density: number; // 0-100
  thickness: number; // 0.5-2.0
};

type EditorPanelProps = {
  settings: EditorSettings;
  onSettingsChange: <K extends keyof EditorSettings>(
    key: K,
    value: EditorSettings[K]
  ) => void;
};

export function EditorPanel({ settings, onSettingsChange }: EditorPanelProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <CardContent className="pt-6 space-y-6">
          <p className="text-sm font-semibold">Opsi Tampilan Pola</p>

          <div className="space-y-2">
            <Label>Repeat</Label>
            <Select
              value={settings.repeat}
              onValueChange={(value: EditorSettings["repeat"]) =>
                onSettingsChange("repeat", value)
              }
            >
              <SelectTrigger className="bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700">
                <SelectValue placeholder="Pilih mode repeat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="half-drop">Half-Drop</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Simetri</Label>
            <Select
              value={settings.symmetry}
              onValueChange={(value: EditorSettings["symmetry"]) =>
                onSettingsChange("symmetry", value)
              }
            >
              <SelectTrigger className="bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700">
                <SelectValue placeholder="Pilih simetri" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tidak Ada</SelectItem>
                <SelectItem value="2">2-Point</SelectItem>
                <SelectItem value="4">4-Point</SelectItem>
                <SelectItem value="8">8-Point</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Kepadatan Isèn</Label>
              <span className="text-xs text-muted-foreground">
                {settings.density}%
              </span>
            </div>
            <Slider
              value={[settings.density]}
              onValueChange={([value]) => onSettingsChange("density", value)}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Ketebalan Garis</Label>
              <span className="text-xs text-muted-foreground">
                {settings.thickness}
              </span>
            </div>
            <Slider
              value={[settings.thickness]}
              onValueChange={([value]) => onSettingsChange("thickness", value)}
              max={10}
              step={0.5}
            />
          </div>

          {/* --- 2. TAMBAHKAN KOTAK INFORMASI DI SINI --- */}
          <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300">
            <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>
              Opsi <strong>Kepadatan Isèn</strong> dan
              <strong> Ketebalan Garis</strong> adalah instruksi untuk proses
              vektorisasi dan hanya akan diterapkan pada file SVG saat Anda
              menekan tombol <strong>Ekspor</strong>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
