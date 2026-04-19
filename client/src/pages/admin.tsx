import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft, Upload, Loader, CheckCircle, Trash2,
  FileText, LayoutDashboard, Plus, Trash, Download, Printer, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { API_ENDPOINTS } from "@/config/api-config";
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

interface InvoiceItem {
  id: string;
  serviceType: string;
  description: string;
  quantity: number;
  rate: number;
  gstRate: number;
}

const SERVICES = [
  { name: "Video Handling", sac: "999612", defaultGst: 18 },
  { name: "Video Post Production", sac: "999612", defaultGst: 18 },
  { name: "Instagram Handling", sac: "998361", defaultGst: 18 },
  { name: "Website Development", sac: "998313", defaultGst: 18 },
  { name: "Custom Service", sac: "998311", defaultGst: 18 },
];

export default function AdminPage() {
  const { logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<"portfolio" | "invoice">("portfolio");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [uploadedCount, setUploadedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Portfolio State
  const [portfolioItems, setPortfolioItems] = useState<StoredPortfolioItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<StoredPortfolioItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deleteMessageType, setDeleteMessageType] = useState<"success" | "error" | "">("");

  // Invoice State
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    date: new Date().toISOString().split('T')[0],
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    items: [{
      id: "1",
      serviceType: "Video Handling",
      description: "Video Management Services",
      quantity: 1,
      rate: 0,
      gstRate: 18
    }] as InvoiceItem[],
  });

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  const fetchPortfolioItems = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.BACKEND}/portfolio`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setPortfolioItems(data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          type: item.type,
          imageUrl: item.image_url,
          videoUrl: item.video_url,
          videoThumbnail: item.video_thumbnail,
          websiteUrl: item.website_url,
        })));
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

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(worksheet);

      if (!rows || rows.length === 0) {
        setMessage("Excel file is empty.");
        setMessageType("error");
        setIsLoading(false);
        return;
      }

      const items: PortfolioItem[] = rows.map((row: any) => {
        const type = String(row.Type || row.type || "poster").toLowerCase().trim();
        const safeString = (val: any) => (val === undefined || val === null ? "" : String(val)).trim();
        return {
          title: safeString(row.Title || row.title || "Untitled"),
          description: safeString(row.Description || row.description),
          type: (["poster", "video", "website"].includes(type) ? type : "poster") as "poster" | "video" | "website",
          imageUrl: safeString(row["Image URL"] || row.imageUrl),
          videoUrl: safeString(row["Video URL"] || row.videoUrl),
          videoThumbnail: safeString(row["Video Thumbnail"] || row.videoThumbnail),
          websiteUrl: safeString(row["Website URL"] || row.websiteUrl),
        };
      });

      const formData = new FormData();
      formData.append("items_json", JSON.stringify({
        items: items.map(i => ({
          ...i,
          image_url: i.imageUrl,
          video_url: i.videoUrl,
          video_thumbnail: i.videoThumbnail,
          website_url: i.websiteUrl
        }))
      }));

      const response = await fetch(`${API_ENDPOINTS.BACKEND}/portfolio/bulk`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      const result = await response.json();
      setMessage(`✅ Sync successful! ${result.synced_count} items added.`);
      setMessageType("success");
      setUploadedCount(result.synced_count);
      fetchPortfolioItems();
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.BACKEND}/portfolio/${selectedItem.id}`, { method: "DELETE" });
      if (response.ok) {
        setDeleteMessage(`✅ Deleted "${selectedItem.title}"`);
        setDeleteMessageType("success");
        setSelectedItem(null);
        fetchPortfolioItems();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Invoice Logic
  const addInvoiceItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, {
        id: Math.random().toString(),
        serviceType: "Video Handling",
        description: "",
        quantity: 1,
        rate: 0,
        gstRate: 18
      }]
    });
  };

  const removeInvoiceItem = (id: string) => {
    setInvoiceData({ ...invoiceData, items: invoiceData.items.filter(i => i.id !== id) });
  };

  const updateInvoiceItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoiceData({
      ...invoiceData,
      items: invoiceData.items.map(i => {
        if (i.id === id) {
          const updated = { ...i, [field]: value };
          // Auto-apply GST if service type changes
          if (field === "serviceType") {
            const service = SERVICES.find(s => s.name === value);
            if (service) updated.gstRate = service.defaultGst;
          }
          return updated;
        }
        return i;
      })
    });
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    const clientSafeName = invoiceData.clientName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    document.title = `${clientSafeName || "client"}_invoice`;
    window.print();
    document.title = originalTitle;
  };

  const subtotal = invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const totalGst = invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.rate * item.gstRate / 100), 0);
  const total = subtotal + totalGst;

  return (
    <div className="min-h-screen bg-[#050510] text-slate-200 flex flex-col md:flex-row font-outfit">

      {/* Hide Sidebar on Print */}
      <aside className="print:hidden w-full md:w-64 bg-slate-900/50 backdrop-blur-3xl border-r border-slate-800 flex-shrink-0 flex flex-col p-6 space-y-8 h-screen sticky top-0">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">K</div>
          <span className="text-xl font-bold tracking-tight text-white">Kairo Admin</span>
        </div>

        <nav className="flex-1 space-y-2">
          <button
            onClick={() => setActiveTab("portfolio")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "portfolio" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "hover:bg-white/5 text-slate-400 hover:text-white"}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Portfolio Manager</span>
          </button>
          <button
            onClick={() => setActiveTab("invoice")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "invoice" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "hover:bg-white/5 text-slate-400 hover:text-white"}`}
          >
            <FileText size={20} />
            <span className="font-medium">Invoice Generator</span>
          </button>
        </nav>

        <button
          onClick={() => logoutMutation.mutate()}
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-red-400 transition-all mt-auto"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-10">

          {activeTab === "portfolio" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-white">Portfolio Manager</h1>
                  <p className="text-slate-500">Update your gallery using Excel sync or manual management.</p>
                </div>
                <div className="flex gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-500 text-white gap-2 px-6 h-12 rounded-xl"
                  >
                    {isLoading ? <Loader className="animate-spin" size={20} /> : <Upload size={20} />}
                    Excel Sync
                  </Button>
                </div>
              </header>

              {message && (
                <div className={`p-4 rounded-2xl border ${messageType === "success" ? "bg-green-500/10 border-green-500/30 text-green-300" : "bg-red-500/10 border-red-500/30 text-red-300"}`}>
                  {message}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Categorized List */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-8">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <LayoutDashboard className="text-blue-500" size={22} />
                    Current Items
                  </h2>

                  {["poster", "video", "website"].map(type => (
                    <div key={type} className="space-y-3">
                      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest px-2">{type}s</h3>
                      <div className="grid gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {portfolioItems.filter(i => i.type === type).length === 0 ? (
                          <div className="p-4 rounded-2xl border border-dashed border-slate-800 text-center text-slate-600 text-sm italic">
                            No {type}s found in database
                          </div>
                        ) : (
                          portfolioItems.filter(i => i.type === type).map(item => (
                            <button
                              key={item.id}
                              onClick={() => setSelectedItem(item)}
                              className={`text-left p-4 rounded-2xl border transition-all ${selectedItem?.id === item.id ? "bg-blue-600/20 border-blue-500 ring-1 ring-blue-500 text-white" : "bg-white/5 border-slate-800 text-slate-400 hover:border-slate-700"}`}
                            >
                              <div className="flex items-center justify-between">
                                <p className="font-semibold truncate">{item.title}</p>
                                <span className="text-[10px] font-mono bg-black/40 px-2 py-0.5 rounded text-slate-500 tracking-tighter">ID: {item.id}</span>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Management Details */}
                <div className="space-y-6">
                  {selectedItem ? (
                    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-6 animate-in zoom-in-95 duration-200">
                      <div className="aspect-video rounded-2xl bg-black overflow-hidden border border-slate-800">
                        {(selectedItem.imageUrl || selectedItem.videoThumbnail) ? (
                          <img
                            src={selectedItem.imageUrl || selectedItem.videoThumbnail}
                            className="w-full h-full object-cover opacity-80"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-700 font-bold">NO PREVIEW</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Selected Item</label>
                        <h2 className="text-2xl font-bold text-white">{selectedItem.title}</h2>
                        <p className="text-slate-400 text-sm leading-relaxed">{selectedItem.description}</p>
                      </div>

                      <div className="pt-4 border-t border-slate-800 flex gap-4">
                        <Button
                          onClick={handleDeleteItem}
                          disabled={isDeleting}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl h-12 gap-2"
                        >
                          {isDeleting ? <Loader className="animate-spin" size={18} /> : <Trash2 size={18} />}
                          Delete Item
                        </Button>
                        <Button
                          onClick={() => setSelectedItem(null)}
                          className="bg-slate-800 hover:bg-slate-700 text-white h-12 px-6 rounded-xl"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center bg-slate-900/40 border border-slate-800 border-dashed rounded-3xl p-10 text-center space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-600 italic font-serif text-3xl">!</div>
                      <div>
                        <h3 className="text-white font-bold">No Item Selected</h3>
                        <p className="text-slate-500 text-sm max-w-[200px] mx-auto">Select a portfolio piece from the dashboard to manage details.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "invoice" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-8 print:hidden">
                <div>
                  <h1 className="text-3xl font-bold text-white">Invoice Generator</h1>
                  <p className="text-slate-500">Create professionally formatted invoices for your clients.</p>
                </div>
                <Button
                  onClick={handlePrint}
                  className="bg-blue-600 hover:bg-blue-500 text-white gap-2 px-6 rounded-xl h-12"
                >
                  <Printer size={20} />
                  Print / Save PDF
                </Button>
              </div>

              {/* Professional Invoice Builder */}
              <div id="printable-invoice" className="w-full bg-white text-slate-900 rounded-[1.5rem] shadow-2xl overflow-hidden print:overflow-visible print:m-0 print:shadow-none print:w-full print:rounded-none">
                <div className="h-2 bg-blue-600 print:h-1" />

                <div className="p-10 md:p-14 space-y-10 print:p-8 print:space-y-6">
                  {/* Phase 1: High-Level Header (Visual Identity & Core Meta) */}
                  <div className="flex flex-col md:flex-row justify-between items-start gap-12 border-b-4 border-slate-900 pb-10 print:pb-6">
                    <div className="space-y-6 flex-1">
                      <img src="/logo.png" alt="Logo" className="h-14 w-auto object-contain print:h-12" />
                      <div className="space-y-1">
                        <div className="text-[10px] font-black uppercase text-blue-600 tracking-[0.2em]">Issued By</div>
                        <div className="text-xs text-slate-500 font-bold leading-relaxed max-w-xs uppercase">
                          Kairo Digital Agency<br />
                          123 Creative Studio, Phase II, Bangalore<br />
                          GSTIN: 29AAAAA0000A1Z5 | +91 98765 43210
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-auto flex flex-col items-end gap-2 px-4 border-l-2 border-slate-100">
                      <h1 className="text-6xl font-black text-slate-100 uppercase tracking-tighter leading-none print:text-slate-200">Invoice</h1>
                      <div className="flex flex-col items-end space-y-2 pt-4">
                        <div className="flex items-center gap-6 group pt-4">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Issue Date</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="date"
                              value={invoiceData.date}
                              onChange={(e) => setInvoiceData({ ...invoiceData, date: e.target.value })}
                              className="print:hidden text-sm font-black border-none p-0 focus:ring-0 bg-transparent text-right cursor-pointer text-blue-600"
                            />
                            <span className="hidden print:block text-sm font-black text-slate-900">{invoiceData.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phase 2: Client Shaded Block (Visual Separator) */}
                  <div className="bg-slate-50/80 p-8 rounded-2xl border border-slate-100 print:bg-transparent print:border-none print:p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-4">
                        <div className="text-[10px] font-black uppercase text-blue-600 tracking-[0.3em] flex items-center gap-3">
                          <div className="w-8 h-1 bg-blue-600" /> Billed To
                        </div>
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Full Client / Company Name"
                            value={invoiceData.clientName}
                            onChange={(e) => setInvoiceData({ ...invoiceData, clientName: e.target.value })}
                            className="print:hidden w-full text-3xl font-black placeholder:text-slate-200 border-none p-0 focus:ring-0 bg-transparent"
                          />
                          <div className="hidden print:block text-3xl font-black uppercase tracking-tighter">{invoiceData.clientName || "[CLIENT NAME]"}</div>

                          <textarea
                            placeholder="Billing Address, GSTIN, Contact Details"
                            value={invoiceData.clientAddress}
                            onChange={(e) => setInvoiceData({ ...invoiceData, clientAddress: e.target.value })}
                            className="print:hidden w-full text-sm text-slate-500 placeholder:text-slate-200 border-none p-0 focus:ring-0 min-h-[60px] resize-none bg-transparent font-medium"
                          />
                          <div className="hidden print:block text-sm text-slate-500 font-bold whitespace-pre-line leading-relaxed uppercase tracking-tight">{invoiceData.clientAddress || "[CLIENT ADDRESS]"}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phase 3: Table Section (Quantitative Alignment) */}
                  <div className="space-y-4">
                    <table className="w-full text-left border-collapse table-fixed">
                      <thead>
                        <tr className="bg-slate-900 text-white rounded-lg overflow-hidden">
                          <th className="py-5 px-6 text-[11px] font-black uppercase tracking-[0.2em] w-[45%]">Service Details</th>
                          <th className="py-5 px-2 text-[11px] font-black uppercase tracking-[0.2em] text-center w-[10%]">Qty</th>
                          <th className="py-5 px-2 text-[11px] font-black uppercase tracking-[0.2em] text-right w-[15%]">Rate (₹)</th>
                          <th className="py-5 px-2 text-[11px] font-black uppercase tracking-[0.2em] text-right w-[10%]">GST %</th>
                          <th className="py-5 px-6 text-[11px] font-black uppercase tracking-[0.2em] text-right w-[20%]">Net Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceData.items.map((item, idx) => (
                          <tr key={item.id} className="border-b-2 border-slate-50 group hover:bg-slate-50 transition-colors">
                            <td className="py-8 px-6 align-top">
                              <div className="flex flex-col gap-2">
                                <div className="text-[9px] font-black text-slate-300 font-mono tracking-tighter uppercase">Reference IR-{idx + 1}</div>
                                <select
                                  value={item.serviceType}
                                  onChange={(e) => updateInvoiceItem(item.id, "serviceType", e.target.value)}
                                  className="print:hidden text-sm font-black text-blue-600 border-none p-0 focus:ring-0 bg-transparent w-full cursor-pointer hover:underline"
                                >
                                  {SERVICES.map(s => <option key={s.name} value={s.name}>{s.name} (SAC {s.sac})</option>)}
                                </select>
                                <div className="hidden print:flex flex-col gap-1">
                                  <div className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.serviceType}</div>
                                  <div className="text-[8px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1">
                                    <div className="w-1 h-1 bg-blue-500 rounded-full" /> SAC Code {SERVICES.find(s => s.name === item.serviceType)?.sac}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-8 px-2 text-center align-top">
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateInvoiceItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                                className="no-spinner w-full text-center text-sm font-black text-slate-800 border-none p-0 focus:ring-0 bg-transparent"
                              />
                            </td>
                            <td className="py-8 px-2 text-right align-top">
                              <input
                                type="number"
                                value={item.rate}
                                onChange={(e) => updateInvoiceItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                                className="no-spinner w-full text-right text-sm font-bold text-slate-800 border-none p-0 focus:ring-0 bg-transparent"
                              />
                            </td>
                            <td className="py-8 px-2 text-right align-top">
                              <div className="flex items-center justify-end gap-0.5">
                                <input
                                  type="number"
                                  value={item.gstRate}
                                  onChange={(e) => updateInvoiceItem(item.id, "gstRate", parseFloat(e.target.value) || 0)}
                                  className="no-spinner w-8 text-right text-xs font-black text-blue-500 border-none p-0 focus:ring-0 bg-transparent"
                                />
                                <span className="text-[10px] font-black text-blue-500">%</span>
                              </div>
                            </td>
                            <td className="py-8 px-6 text-right font-black text-slate-900 group align-top">
                              <div className="flex flex-col items-end">
                                <div className="flex items-center justify-end gap-2">
                                  <span className="text-sm">₹{(item.quantity * item.rate * (1 + item.gstRate / 100)).toLocaleString('en-IN')}</span>
                                  <button
                                    onClick={() => removeInvoiceItem(item.id)}
                                    className="print:hidden p-1 text-red-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                  >
                                    <Trash size={14} />
                                  </button>
                                </div>
                                <div className="text-[8px] text-slate-300 font-black uppercase tracking-widest mt-1">Inclusive</div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    onClick={addInvoiceItem}
                    className="print:hidden w-full py-3 border-2 border-dashed border-slate-100 rounded-xl text-slate-300 hover:border-blue-100 hover:text-blue-500 transition-all flex items-center justify-center gap-2 font-bold text-sm"
                  >
                    <Plus size={16} /> Add Line Item
                  </button>

                  {/* Phase 4: Summarized Footer (Visual Emphasis) */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pt-10 border-t-4 border-slate-900 print:pt-6">
                    <div className="md:col-span-7">
                      {/* Left empty to push totals to the right */}
                    </div>

                    <div className="md:col-span-5 flex flex-col items-end gap-6">
                      <div className="w-full bg-slate-900 text-white rounded-3xl p-8 space-y-6 shadow-2xl shadow-blue-500/20 print:bg-slate-100 print:text-slate-900 print:shadow-none print:p-6 print:rounded-2xl">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-slate-400 print:text-slate-500">
                            <span className="text-[10px] font-black uppercase tracking-widest">Gross Subtotal</span>
                            <span className="text-sm font-black">₹{subtotal.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between items-center text-blue-400 print:text-blue-600">
                            <span className="text-[10px] font-black uppercase tracking-widest">Applicable GST</span>
                            <span className="text-sm font-black">+ ₹{totalGst.toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        <div className="pt-6 border-t border-white/10 print:border-slate-300 space-y-1">
                          <span className="text-[12px] font-black uppercase tracking-[0.4em] text-blue-400 print:text-blue-600">Total Payable</span>
                          <div className="flex justify-between items-end">
                            <div className="text-4xl font-black tracking-tighter">₹{total.toLocaleString('en-IN')}</div>
                            <div className="text-[8px] font-black text-slate-500 uppercase pb-1 italic">All amounts in INR</div>
                          </div>
                        </div>
                      </div>

                      {/* Digital Signature */}
                      <div className="flex flex-col items-end gap-2 pr-4">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Digital Signature</div>
                        <img src="/signature.jpg" alt="Signature" className="h-16 w-auto mix-blend-multiply opacity-90 print:h-14" />
                        <div className="h-px w-32 bg-slate-200" />
                        <div className="text-[10px] font-black text-slate-900 uppercase">Authorized Signatory</div>
                      </div>
                    </div>
                  </div>

                  {/* Final Integrated Footer Block */}
                  <div className="pt-10 border-t border-slate-100 space-y-10">

                    {/* Phase 5: Banking Details (Primary Payment Call to Action) */}
                    <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 print:bg-transparent print:border-none print:p-0 print:flex-col print:text-center print:gap-4">
                      <div className="flex items-center gap-4 print:flex-col print:gap-2">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs print:w-8 print:h-8">PAY</div>
                        <div className="space-y-0.5">
                          <div className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Banking & Payment Details</div>
                          <div className="text-xs font-bold text-slate-900 uppercase">HDFC BANK | KAIRO DIGITAL AGENCY | A/C: 50200012345678 | IFSC: HDFC0001234</div>
                        </div>
                      </div>
                      <div className="text-right print:text-center">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">UPI ID</div>
                        <div className="text-sm font-black text-blue-600 tracking-tight">kairodigital@okhdfc</div>
                      </div>
                    </div>

                    {/* Phase 6: Final Certification & Legal Authority */}
                    <div className="space-y-8 pt-6">
                      <div className="flex flex-col items-center text-center gap-4">
                        <div className="text-[10px] font-bold text-slate-400 uppercase italic max-w-2xl leading-relaxed">
                          "WE HEREBY CERTIFY THAT THIS INVOICE SHOWS THE ACTUAL PRICE OF THE GOODS/SERVICES DESCRIBED AND THAT ALL PARTICULARS ARE TRUE AND CORRECT."
                        </div>
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white rounded-full">
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Kairo Digital Agency Official Document</span>
                        </div>
                      </div>

                      <div className="space-y-4 pt-6 border-t border-slate-50">
                        <div className="text-[10px] font-black uppercase text-blue-600 tracking-[0.5em] text-center">Legal Declarations</div>
                        <div className="flex flex-col md:flex-row justify-center items-center gap-x-12 gap-y-2 text-[9px] font-black text-slate-400 uppercase tracking-tight">
                          <p>• GOODS ONCE SOLD WILL NOT BE TAKEN BACK OR EXCHANGED</p>
                          <p>• INTEREST @ 18% P.A. WILL BE CHARGED IF PAYMENT IS NOT MADE WITHIN 7 DAYS</p>
                          <p>• OUR RESPONSIBILITY CEASES AS SOON AS SERVICES ARE DELIVERED</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @page {
          size: A4;
          margin: 0;
        }
        @media print {
          title { display: none; }
          body { background: white !important; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          
          /* Hide everything first to avoid extension interference */
          body * { visibility: hidden; }
          
          /* Only show the invoice and its children */
          #printable-invoice, #printable-invoice * { visibility: visible; }
          
          /* Position the invoice at the very top for printing */
          #printable-invoice {
            visibility: visible !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }

          .min-h-screen { min-height: 0 !important; }
          main { padding: 0 !important; margin: 0 !important; overflow: visible !important; }
          
          /* Force tighter padding for the invoice container on A4 */
          .p-10, .md\:p-14, .print\:p-8 { padding: 15mm !important; } 

          /* Ensure nothing is hidden */
          * { overflow: visible !important; }
          
          /* Prevent items from breaking across pages */
          .grid { page-break-inside: avoid; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }

        /* Remove arrows from number inputs */
        .no-spinner::-webkit-inner-spin-button, 
        .no-spinner::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        .no-spinner {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}
