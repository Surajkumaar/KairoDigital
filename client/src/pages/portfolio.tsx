import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ExternalLink, Moon, Play, Sun, X } from "lucide-react";
import Footer from "@/components/layout/footer";
import FloatingActions from "@/components/layout/floating-actions";
import {
  portfolioDescriptions,
  portfolioTitles,
  posterNames,
  posterPaths,
  videoLinks,
  videoNames,
  videoThumbnailPaths,
  websiteLinks,
} from "@/config/portfolio-links";

type TabType = "all" | "posters" | "videos" | "websites";

type PosterItem = {
  id: number;
  title: string;
  description: string;
  image: string;
  websiteUrl: string;
};

type WebsiteItem = {
  id: number;
  title: string;
  description: string;
  websiteUrl: string;
};

type VideoItem = {
  id: number;
  title: string;
  thumbnail: string;
  driveUrl?: string;
  isPlayable: boolean;
};

function isPlaceholderValue(value: string | undefined): boolean {
  const normalized = value?.trim().toLowerCase() || "";
  if (!normalized) return true;
  return (
    normalized.startsWith("replace_") ||
    normalized === "#" ||
    normalized.includes("placehold.co")
  );
}

function getDefaultVideoThumbnail(index: number): string {
  return `https://placehold.co/1280x720/1e293b/cbd5e1?text=Video+Thumbnail+${index + 1}`;
}

function getDriveFileId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (!trimmed.includes("drive.google.com")) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    
    // Check for direct export URLs: drive.google.com/uc?export=view&id=...
    if (parsed.pathname === "/uc") {
      const id = parsed.searchParams.get("id");
      if (id) return id;
    }
    
    // Check for standard file URLs: /file/d/ID/view
    const directMatch = parsed.pathname.match(/\/file\/d\/([^/]+)/);
    return directMatch?.[1] || parsed.searchParams.get("id");
  } catch {
    return null;
  }
}

function getDriveThumbnailUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  
  const fileId = getDriveFileId(url);
  if (!fileId) return null;
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1280`;
}

function getResolvedPosterImage(path: string | undefined, index: number): string {
  const raw = path?.trim();
  if (!raw) {
    return `https://placehold.co/600x800/2563eb/ffffff?text=Poster+${index + 1}`;
  }

  // Direct export URLs work as-is for images
  if (raw.includes("drive.google.com/uc?export=download") || raw.includes("drive.google.com/uc?export=view")) {
    return raw;
  }

  if (raw.includes("drive.google.com")) {
    return (
      getDriveThumbnailUrl(raw) ||
      `https://placehold.co/600x800/2563eb/ffffff?text=Poster+${index + 1}`
    );
  }

  return raw;
}

const totalItems = Math.max(
  portfolioTitles.length,
  portfolioDescriptions.length,
  posterPaths.length
);

const posters: PosterItem[] = Array.from({ length: totalItems }, (_, index) => ({
  id: index + 1,
  title: posterNames[index] || portfolioTitles[index] || `Poster ${index + 1}`,
  description:
    portfolioDescriptions[index] ||
    "Poster campaign and digital rollout for client brand visibility.",
  image: getResolvedPosterImage(posterPaths[index], index),
  websiteUrl: websiteLinks[index] || "#",
}));

const videos: VideoItem[] = videoLinks.map((videoLink, index) => {
  const rawValue = videoLink?.trim() || "";
  const validDrive = !isPlaceholderValue(rawValue);

  const driveUrl = !validDrive
    ? undefined
    : rawValue.includes("drive.google.com")
      ? rawValue
      : `https://drive.google.com/file/d/${rawValue}/view?usp=sharing`;

  // Get explicit thumbnail from config
  const explicitThumbnail = videoThumbnailPaths[index]?.trim();
  const validExplicitThumbnail = !isPlaceholderValue(explicitThumbnail);

  // Use explicit thumbnail if available, otherwise derive from video
  let thumbnail: string;
  if (validExplicitThumbnail) {
    // If it's already a weserv or direct URL, use it as-is
    // Otherwise if it's Google Drive, get the thumbnail URL
    if (explicitThumbnail.includes("weserv.nl") || !explicitThumbnail.includes("drive.google.com")) {
      thumbnail = explicitThumbnail;
    } else {
      thumbnail = getDriveThumbnailUrl(explicitThumbnail) || getDefaultVideoThumbnail(index);
    }
  } else {
    // Fallback to deriving from video link or use default
    thumbnail = (driveUrl ? getDriveThumbnailUrl(driveUrl) : null) || getDefaultVideoThumbnail(index);
  }

  return {
    id: index + 1,
    title: videoNames[index] || `Video ${index + 1}`,
    thumbnail,
    driveUrl,
    isPlayable: !!driveUrl,
  };
});

const websites: WebsiteItem[] = websiteLinks.map((websiteUrl, index) => ({
  id: index + 1,
  title: portfolioTitles[index] || `Website ${index + 1}`,
  description:
    portfolioDescriptions[index] ||
    "Website link for this project.",
  websiteUrl,
}));

function getDrivePreviewUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";

  if (!trimmed.includes("drive.google.com")) {
    return `https://drive.google.com/file/d/${trimmed}/preview`;
  }

  try {
    const parsed = new URL(trimmed);
    const resourceKey = parsed.searchParams.get("resourcekey");
    
    // Handle direct export URLs
    if (parsed.pathname === "/uc") {
      const fileId = parsed.searchParams.get("id");
      if (fileId) {
        const preview = new URL(`https://drive.google.com/file/d/${fileId}/preview`);
        if (resourceKey) {
          preview.searchParams.set("resourcekey", resourceKey);
        }
        preview.searchParams.set("embedded", "true");
        return preview.toString();
      }
    }
    
    // Handle standard file URLs
    const directMatch = parsed.pathname.match(/\/file\/d\/([^/]+)/);
    const fileId = directMatch?.[1] || parsed.searchParams.get("id");

    if (!fileId) {
      return trimmed;
    }

    const preview = new URL(`https://drive.google.com/file/d/${fileId}/preview`);
    if (resourceKey) {
      preview.searchParams.set("resourcekey", resourceKey);
    }
    preview.searchParams.set("embedded", "true");

    return preview.toString();
  } catch {
    return trimmed;
  }
}

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [search, setSearch] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("portfolio-theme");
    setIsDark(savedTheme !== "light");
  }, []);

  useEffect(() => {
    localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedVideo(null);
      }
    };

    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  const query = search.trim().toLowerCase();

  const filteredPosters = useMemo(
    () =>
      posters.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      ),
    [query]
  );

  const filteredVideos = useMemo(
    () => videos.filter((item) => item.title.toLowerCase().includes(query)),
    [query]
  );

  const playableVideoCount = useMemo(
    () => filteredVideos.filter((item) => item.isPlayable).length,
    [filteredVideos]
  );

  const filteredWebsites = useMemo(
    () =>
      websites.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.websiteUrl.toLowerCase().includes(query)
      ),
    [query]
  );

  const rootClasses = isDark
    ? "bg-slate-950 text-slate-100"
    : "bg-slate-50 text-slate-900";

  const headerClasses = isDark
    ? "bg-slate-900/80 border-slate-800"
    : "bg-white/80 border-slate-200";

  const panelClasses = isDark
    ? "bg-slate-900 border-slate-800"
    : "bg-white border-slate-200";

  const tabButtonClass = (tab: TabType) => {
    const active = tab === activeTab;
    if (active) {
      return "px-6 py-3 text-sm font-medium border-b-2 border-blue-500 text-blue-600";
    }

    return isDark
      ? "px-6 py-3 text-sm font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200"
      : "px-6 py-3 text-sm font-medium border-b-2 border-transparent text-slate-500 hover:text-slate-700";
  };

  return (
    <div className={`${rootClasses} min-h-screen transition-colors duration-300`}>
      <header className={`sticky top-0 z-50 w-full backdrop-blur-md border-b ${headerClasses}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-blue-500"
          >
            <ArrowLeft size={16} />
            Back
          </a>

          <h1 className="text-xl font-bold tracking-tight">Media Gallery</h1>

          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative w-full">
              <input
                className={`w-full pl-4 pr-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? "bg-slate-800 text-slate-100 placeholder:text-slate-400"
                    : "bg-slate-100 text-slate-900 placeholder:text-slate-500"
                }`}
                placeholder="Search gallery..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <button
              className={`p-2 rounded-full transition-colors ${
                isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"
              }`}
              onClick={() => setIsDark((prev) => !prev)}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className={`flex space-x-2 border-b ${isDark ? "border-slate-800" : "border-slate-200"}`}>
          <button className={tabButtonClass("all")} onClick={() => setActiveTab("all")}>All</button>
          <button className={tabButtonClass("posters")} onClick={() => setActiveTab("posters")}>Posters</button>
          <button className={tabButtonClass("videos")} onClick={() => setActiveTab("videos")}>Videos</button>
          <button className={tabButtonClass("websites")} onClick={() => setActiveTab("websites")}>Websites</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {(activeTab === "all" || activeTab === "posters") && (
          <section className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Posters</h2>
              <span className="text-sm text-slate-500">{filteredPosters.length} Items</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredPosters.map((poster) => (
                <article key={poster.id} className="group">
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl shadow-sm cursor-pointer relative transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-slate-800">
                    <img
                      src={poster.image}
                      alt={poster.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      onError={(event) => {
                        const fallback = `https://placehold.co/600x800/2563eb/ffffff?text=Poster+${poster.id}`;
                        if (event.currentTarget.src !== fallback) {
                          event.currentTarget.src = fallback;
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className={`mt-3 text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    {poster.title}
                  </h3>
                </article>
              ))}
            </div>
          </section>
        )}

        {(activeTab === "all" || activeTab === "videos") && (
          <section className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Videos</h2>
              <span className="text-sm text-slate-500">
                {playableVideoCount}/{filteredVideos.length} Playable
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <button
                  key={video.id}
                  type="button"
                  className={`relative aspect-video rounded-2xl overflow-hidden shadow-sm group transition-all duration-300 text-left ${
                    video.isPlayable
                      ? "hover:-translate-y-1 hover:shadow-xl"
                      : "cursor-not-allowed opacity-70"
                  }`}
                  onClick={() => {
                    if (video.isPlayable) {
                      setSelectedVideo(video);
                    }
                  }}
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                    loading="lazy"
                    onError={(event) => {
                      const fallback = getDefaultVideoThumbnail(video.id - 1);
                      if (event.currentTarget.src !== fallback) {
                        event.currentTarget.src = fallback;
                      }
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                      <Play size={28} fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-sm font-medium drop-shadow-md">{video.title}</p>
                    {!video.isPlayable && (
                      <p className="text-amber-300 text-xs mt-1 drop-shadow-md">
                        Add a Drive link in config to play
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {(activeTab === "all" || activeTab === "websites") && (
          <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Websites</h2>
              <span className="text-sm text-slate-500">{filteredWebsites.length} Items</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredWebsites.map((site) => (
                <div
                  key={site.id}
                  className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col items-start ${panelClasses}`}
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4 font-bold">
                    {site.id}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{site.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 flex-grow">{site.description}</p>
                  <a
                    href={site.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`w-full py-2.5 text-center font-medium rounded-xl transition-colors inline-flex items-center justify-center gap-2 ${
                      isDark
                        ? "bg-slate-100 text-slate-900 hover:bg-white"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    Visit Website
                    <ExternalLink size={16} />
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {selectedVideo && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/90 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-slate-300 z-10 bg-black/50 p-2 rounded-full backdrop-blur-md"
              onClick={() => setSelectedVideo(null)}
              aria-label="Close video"
            >
              <X size={22} />
            </button>

            <div className="aspect-video bg-black">
              {selectedVideo.driveUrl ? (
                <div className="relative w-full h-full">
                  <iframe
                    className="w-full h-full"
                    src={getDrivePreviewUrl(selectedVideo.driveUrl)}
                    title={selectedVideo.title}
                    allow="autoplay; encrypted-media; fullscreen"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center gap-4 text-slate-300">
                  <p className="text-lg font-medium">Drive link is missing for this video.</p>
                </div>
              )}
            </div>

            {selectedVideo.driveUrl && (
              <div className="p-4 border-t border-slate-800 flex justify-between items-center">
                <p className="text-slate-300 text-sm">Now Playing: {selectedVideo.title}</p>
                <a
                  href={selectedVideo.driveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
                >
                  Open in Drive
                  <ExternalLink size={14} />
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
      <FloatingActions />
    </div>
  );
}
