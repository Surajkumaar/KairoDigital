import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Upload, Loader, CheckCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

interface PortfolioItem {
  title: string;
  description?: string;
  type: "poster" | "video" | "website";
  imageUrl?: string;
  videoUrl?: string;
  videoThumbnail?: string;
  websiteUrl?: string;
}

interface StoredPortfolioItem extends PortfolioItem {
  id: number;
}

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [uploadedCount, setUploadedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Delete functionality
  const [portfolioItems, setPortfolioItems] = useState<StoredPortfolioItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<StoredPortfolioItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deleteMessageType, setDeleteMessageType] = useState<"success" | "error" | "">("");

  // Fetch portfolio items on mount
  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  const fetchPortfolioItems = async () => {
    try {
      const response = await fetch("/api/portfolio");
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setPortfolioItems(result.data);
      }
    } catch (error) {
      console.error("Error fetching portfolio items:", error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setMessage("");
    setUploadedCount(0);

    try {
      // Read Excel file
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet);

      if (!rows || rows.length === 0) {
        setMessage("Excel file is empty. Please add data and try again.");
        setMessageType("error");
        setIsLoading(false);
        return;
      }

      // Parse and validate data
      const portfolioItems: PortfolioItem[] = rows.map((row: any) => {
        const type = (row.Type || row.type || "poster").toLowerCase().trim();
        
        // Validate type
        if (!["poster", "video", "website"].includes(type)) {
          console.warn(`Invalid type: "${type}", defaulting to "poster"`);
        }

        return {
          title: (row.Title || row.title || "Untitled").trim(),
          description: (row.Description || row.description || "").trim(),
          type: (["poster", "video", "website"].includes(type) ? type : "poster") as "poster" | "video" | "website",
          imageUrl: (row["Image URL"] || row.imageUrl || "").trim(),
          videoUrl: (row["Video URL"] || row.videoUrl || "").trim(),
          videoThumbnail: (row["Video Thumbnail"] || row.videoThumbnail || "").trim(),
          websiteUrl: (row["Website URL"] || row.websiteUrl || "").trim(),
        };
      });

      console.log("📤 Uploading portfolio items:", portfolioItems);

      // Send to backend
      const response = await fetch("/api/portfolio/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: portfolioItems }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage(`✅ Successfully synced ${portfolioItems.length} items! Updating posters and videos...`);
        setMessageType("success");
        setUploadedCount(portfolioItems.length);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        // Refresh portfolio items list after upload
        setTimeout(() => {
          fetchPortfolioItems();
          window.location.href = "/portfolio";
        }, 2000);
      } else {
        setMessage(result.message || "Failed to upload items");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error processing file:", error);
      setMessage("Error processing Excel file. Please check the format and try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;

    setIsDeleting(true);
    setDeleteMessage("");

    try {
      const response = await fetch(`/api/portfolio/${selectedItem.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setDeleteMessage(`✅ Successfully deleted "${selectedItem.title}"!`);
        setDeleteMessageType("success");
        setSelectedItem(null);
        
        // Refresh the list
        setTimeout(() => {
          fetchPortfolioItems();
        }, 1000);
      } else {
        setDeleteMessage(result.message || "Failed to delete item");
        setDeleteMessageType("error");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      setDeleteMessage("Error deleting item. Please try again.");
      setDeleteMessageType("error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-10">
        <button
          onClick={() => window.location.href = "/"}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors bg-slate-800/50 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700/50 hover:border-slate-600"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Admin Dashboard
            </h1>
            <p className="text-slate-400 text-lg">
              Manage your portfolio items with Excel uploads
            </p>
          </div>

          {/* Success State */}
          {messageType === "success" && uploadedCount > 0 && (
            <div className="mb-8 p-6 bg-green-500/10 border border-green-500/30 rounded-xl">
              <div className="flex items-start gap-4">
                <CheckCircle className="text-green-400 mt-1 flex-shrink-0" size={24} />
                <div>
                  <p className="text-green-200 font-semibold mb-1">Upload Successful!</p>
                  <p className="text-green-200/80">
                    {uploadedCount} portfolio items were successfully imported. Redirecting to home page...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {messageType === "error" && (
            <div className="mb-8 p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-200">{message}</p>
            </div>
          )}

          {/* Upload Card */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-2">Upload Portfolio</h2>
            <p className="text-slate-400 mb-6">
              Upload an Excel file to update your portfolio items
            </p>

            {/* Instructions */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
              <p className="text-blue-200 text-sm font-medium mb-2">Excel File Format:</p>
              <ul className="text-blue-200/80 text-sm space-y-1">
                <li>• <strong>Title</strong> (required)</li>
                <li>• <strong>Description</strong></li>
                <li>• <strong>Type</strong> (poster or video)</li>
                <li>• <strong>Image URL</strong> (for posters)</li>
                <li>• <strong>Video URL</strong> (for videos)</li>
                <li>• <strong>Video Thumbnail</strong> (for videos)</li>
                <li>• <strong>Website URL</strong> (optional)</li>
              </ul>
            </div>

            {/* File Upload Area */}
            <div
              className="border-2 border-dashed border-slate-600 rounded-lg p-12 text-center hover:border-slate-400 transition-all cursor-pointer bg-slate-800/30"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={48} className="mx-auto mb-4 text-slate-400" />
              <p className="text-white font-semibold text-lg mb-2">
                Click to upload Excel file
              </p>
              <p className="text-slate-400">
                or drag and drop (.xlsx or .xls format)
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

            {/* Loading State */}
            {isLoading && (
              <div className="mt-6 flex items-center justify-center gap-3 text-slate-300">
                <Loader size={20} className="animate-spin" />
                <span>Processing file...</span>
              </div>
            )}

            {/* Warning */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-blue-200 text-sm">
                <strong>ℹ️ How it works:</strong> Items are synced by Title and Type. An item with the same Title and Type will be updated. New items are added. This lets you update individual items without losing others.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-3">
              <Button
                onClick={() => window.location.href = "/"}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white"
              >
                Go Back Home
              </Button>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-12 p-6 bg-slate-800/30 border border-slate-700/50 rounded-xl">
            <h3 className="text-white font-semibold mb-3">Need Help?</h3>
            <div className="space-y-2 text-slate-300 text-sm">
              <p>
                • <strong>YouTube videos:</strong> Use URLs like <code className="bg-slate-900/50 px-2 py-1 rounded">https://youtu.be/VIDEO_ID</code>
              </p>
              <p>
                • <strong>Google Drive:</strong> Use preview links like <code className="bg-slate-900/50 px-2 py-1 rounded">https://drive.google.com/file/d/FILE_ID/preview</code>
              </p>
              <p>
                • <strong>Images:</strong> Use direct URLs or Google Drive image links
              </p>
            </div>
          </div>

          {/* Delete Section */}
          <div className="mt-12 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-2">Delete Portfolio Item</h2>
            <p className="text-slate-400 mb-6">
              Select an item to delete from your portfolio
            </p>

            {/* Delete Success Message */}
            {deleteMessageType === "success" && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-green-200">{deleteMessage}</p>
              </div>
            )}

            {/* Delete Error Message */}
            {deleteMessageType === "error" && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-200">{deleteMessage}</p>
              </div>
            )}

            {/* Portfolio Items List - Categorized */}
            <div className="space-y-4 mb-6">
              {/* Posters Section */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  📸 Posters ({portfolioItems.filter(i => i.type === "poster").length})
                </label>
                <div className="grid gap-2 max-h-44 overflow-y-auto">
                  {portfolioItems.filter(i => i.type === "poster").length === 0 ? (
                    <p className="text-slate-500 text-sm py-2">No posters</p>
                  ) : (
                    portfolioItems.filter(i => i.type === "poster").map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`text-left p-3 rounded-lg border transition-all ${
                          selectedItem?.id === item.id
                            ? "bg-blue-500/20 border-blue-500 text-white"
                            : "bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{item.title}</p>
                            <p className="text-xs opacity-75">
                              {item.description && `${item.description.substring(0, 30)}...`}
                            </p>
                          </div>
                          <span className="text-xs bg-slate-900 px-2 py-1 rounded whitespace-nowrap">
                            ID: {item.id}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Videos Section */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  🎬 Videos ({portfolioItems.filter(i => i.type === "video").length})
                </label>
                <div className="grid gap-2 max-h-44 overflow-y-auto">
                  {portfolioItems.filter(i => i.type === "video").length === 0 ? (
                    <p className="text-slate-500 text-sm py-2">No videos</p>
                  ) : (
                    portfolioItems.filter(i => i.type === "video").map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`text-left p-3 rounded-lg border transition-all ${
                          selectedItem?.id === item.id
                            ? "bg-blue-500/20 border-blue-500 text-white"
                            : "bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{item.title}</p>
                            <p className="text-xs opacity-75">
                              {item.description && `${item.description.substring(0, 30)}...`}
                            </p>
                          </div>
                          <span className="text-xs bg-slate-900 px-2 py-1 rounded whitespace-nowrap">
                            ID: {item.id}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Websites/Links Section */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  🔗 Websites/Links ({portfolioItems.filter(i => i.type === "website").length})
                </label>
                <div className="grid gap-2 max-h-44 overflow-y-auto">
                  {portfolioItems.filter(i => i.type === "website").length === 0 ? (
                    <p className="text-slate-500 text-sm py-2">No websites</p>
                  ) : (
                    portfolioItems.filter(i => i.type === "website").map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`text-left p-3 rounded-lg border transition-all ${
                          selectedItem?.id === item.id
                            ? "bg-blue-500/20 border-blue-500 text-white"
                            : "bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{item.title}</p>
                            <p className="text-xs opacity-75">
                              {item.websiteUrl && `${item.websiteUrl.substring(0, 30)}...`}
                            </p>
                          </div>
                          <span className="text-xs bg-slate-900 px-2 py-1 rounded whitespace-nowrap">
                            ID: {item.id}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Selected Item Details */}
            {selectedItem && (
              <div className="mb-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                <p className="text-slate-300 text-sm mb-2">
                  <strong>Selected:</strong> {selectedItem.title}
                </p>
                <p className="text-slate-400 text-sm mb-3">
                  <strong>Type:</strong> {selectedItem.type}
                </p>
                <p className="text-red-200 text-sm">
                  ⚠️ This action cannot be undone. Are you sure you want to delete this item?
                </p>
              </div>
            )}

            {/* Delete Button */}
            <button
              onClick={handleDeleteItem}
              disabled={!selectedItem || isDeleting}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                selectedItem && !isDeleting
                  ? "bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                  : "bg-slate-700 text-slate-400 cursor-not-allowed opacity-50"
              }`}
            >
              {isDeleting ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={18} />
                  Delete Selected Item
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
