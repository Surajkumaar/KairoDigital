import { useState, useRef } from "react";
import { X, Upload, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS } from "@/config/api-config";
import * as XLSX from "xlsx";

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PortfolioItem {
  title: string;
  description?: string;
  type: "poster" | "video";
  imageUrl?: string;
  videoUrl?: string;
  videoThumbnail?: string;
  websiteUrl?: string;
}

export default function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setMessage("");

    try {
      // Read Excel file
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet);

      // Parse and validate data
      const portfolioItems: PortfolioItem[] = rows.map((row: any) => ({
        title: row.Title || row.title || "Untitled",
        description: row.Description || row.description || "",
        type: (row.Type || row.type || "poster").toLowerCase() as "poster" | "video",
        imageUrl: row["Image URL"] || row.imageUrl || "",
        videoUrl: row["Video URL"] || row.videoUrl || "",
        videoThumbnail: row["Video Thumbnail"] || row.videoThumbnail || "",
        websiteUrl: row["Website URL"] || row.websiteUrl || "",
      }));

      // Send to backend
      const response = await fetch(`${API_ENDPOINTS.BACKEND}/portfolio/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: portfolioItems }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage(`Successfully uploaded ${portfolioItems.length} items! Refresh the page to see changes.`);
        setMessageType("success");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        // Auto close after 3 seconds
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 3000);
      } else {
        setMessage(result.message || "Failed to upload items");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error processing file:", error);
      setMessage("Error processing Excel file. Please check the format.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              messageType === "success"
                ? "bg-green-500/20 border border-green-500/50 text-green-200"
                : "bg-red-500/20 border border-red-500/50 text-red-200"
            }`}
          >
            {message}
          </div>
        )}

        {/* Upload Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Upload Portfolio Data
            </h3>
            <p className="text-slate-300 text-sm mb-4">
              Upload an Excel file with your portfolio items. The file should contain these columns:
            </p>
            <div className="bg-slate-800/50 p-4 rounded-lg mb-4">
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• <strong>Title</strong> (required)</li>
                <li>• <strong>Description</strong></li>
                <li>• <strong>Type</strong> (poster or video)</li>
                <li>• <strong>Image URL</strong> (for posters)</li>
                <li>• <strong>Video URL</strong> (for videos - YouTube or Google Drive)</li>
                <li>• <strong>Video Thumbnail</strong> (for videos)</li>
                <li>• <strong>Website URL</strong></li>
              </ul>
            </div>
          </div>

          {/* File Upload Area */}
          <div
            className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-slate-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={32} className="mx-auto mb-3 text-slate-400" />
            <p className="text-white font-medium mb-2">
              Click to upload Excel file
            </p>
            <p className="text-slate-400 text-sm">
              (.xlsx or .xls format)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="hidden"
            />
          </div>

          {/* Instructions */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-200 text-sm">
                <strong>Tip:</strong> Uploads sync with existing items. Items with the same Title and Type are updated, new items are added. This way you can update individual items without losing others.
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-slate-300">
              <Loader size={20} className="animate-spin" />
              <span>Processing file...</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
