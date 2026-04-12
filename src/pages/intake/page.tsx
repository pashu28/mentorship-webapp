import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface LocationState {
  name?: string;
  occupation?: string;
  isNew?: boolean;
}

export default function IntakePage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dreamRole, setDreamRole] = useState("");
  const [challenge, setChallenge] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || {};
  const userName = state.name || "there";
  const isNew = state.isNew ?? true;

  // ... existing code ...

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      navigate("/profile-summary");
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#7C3AED" }}>
            <i className="ri-sparkling-2-fill text-white text-sm" />
          </div>
          <span className="font-bold text-gray-900 text-lg">MentorAI</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 flex items-center justify-center rounded-full bg-violet-600 text-white text-xs font-bold">1</div>
          <div className="w-16 h-0.5 bg-gray-200" />
          <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 text-gray-400 text-xs font-bold">2</div>
          <div className="w-16 h-0.5 bg-gray-200" />
          <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 text-gray-400 text-xs font-bold">3</div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl">

          {/* Header */}
          <div className="text-center mb-12">
            {/* Personalised greeting — hero moment */}
            {userName ? (
              <>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-3">
                  Hey, {userName}! 👋
                </h1>
                <p className="text-lg text-gray-500 mb-1">
                  Let's build your{" "}
                  <span className="font-semibold bg-gradient-to-r from-violet-600 to-emerald-500 bg-clip-text text-transparent">
                    mentorship profile.
                  </span>
                </p>
                <p className="text-sm text-gray-400">
                  Upload your resume and share your goals — our AI handles the rest.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                  Let's build your{" "}
                  <span className="bg-gradient-to-r from-violet-600 to-emerald-500 bg-clip-text text-transparent">
                    mentorship profile
                  </span>
                </h1>
                <p className="text-gray-500 text-lg">
                  Upload your resume and share your goals — our AI handles the rest.
                </p>
              </>
            )}
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative w-full rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer mb-8 ${
              isDragging
                ? "border-violet-500 bg-violet-50 scale-[1.01]"
                : uploadedFile
                ? "border-emerald-400 bg-emerald-50"
                : "border-gray-300 bg-white hover:border-violet-400 hover:bg-violet-50/30"
            }`}
            style={{ minHeight: "220px" }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="flex flex-col items-center justify-center py-14 px-8 text-center">
              {uploadedFile ? (
                <>
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-emerald-100 mb-4">
                    <i className="ri-file-check-line text-emerald-600 text-3xl" />
                  </div>
                  <p className="font-semibold text-emerald-700 text-lg">{uploadedFile.name}</p>
                  <p className="text-emerald-500 text-sm mt-1">Resume uploaded successfully</p>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                    className="mt-3 text-xs text-gray-400 hover:text-gray-600 underline cursor-pointer"
                  >
                    Remove file
                  </button>
                </>
              ) : (
                <>
                  <div className={`w-16 h-16 flex items-center justify-center rounded-full mb-4 transition-all ${isDragging ? "bg-violet-100" : "bg-gray-100"}`}>
                    <i className={`ri-upload-cloud-2-line text-3xl transition-all ${isDragging ? "text-violet-600" : "text-gray-400"}`} />
                  </div>
                  <p className="font-semibold text-gray-700 text-lg mb-1">
                    {isDragging ? "Drop it here!" : "Drag your resume here"}
                  </p>
                  <p className="text-gray-400 text-sm">or click to browse — PDF only</p>
                  <div className="mt-4 px-4 py-1.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
                    PDF up to 10MB
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Input Fields */}
          <div className="flex flex-col gap-5 mb-10">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                <i className="ri-sparkling-2-line text-violet-500 text-base" />
              </div>
              <input
                type="text"
                value={dreamRole}
                onChange={(e) => setDreamRole(e.target.value)}
                placeholder="What is your dream role?"
                className="w-full pl-11 pr-4 py-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
              />
            </div>
            <div className="relative">
              <div className="absolute left-4 top-4 w-5 h-5 flex items-center justify-center">
                <i className="ri-focus-3-line text-violet-500 text-base" />
              </div>
              <textarea
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                placeholder="What is your biggest current challenge?"
                rows={3}
                className="w-full pl-11 pr-4 py-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all resize-none"
              />
            </div>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white font-bold text-base hover:from-violet-700 hover:to-violet-600 transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-3 whitespace-nowrap cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <i className="ri-loader-4-line animate-spin text-lg" />
                Analyzing your profile...
              </>
            ) : (
              <>
                <i className="ri-sparkling-2-fill text-lg" />
                Generate My Profile
                <i className="ri-arrow-right-line text-lg" />
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            Your data is private and never shared without your consent.
          </p>
        </div>
      </main>
    </div>
  );
}
