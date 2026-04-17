import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OnboardingNav from "@/pages/onboarding/components/OnboardingNav";

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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-base)" }}>
      <OnboardingNav currentStep={0} unlockedUpTo={0} />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl">

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-3" style={{ color: "var(--text-primary)" }}>
              Hey, {userName}! 👋
            </h1>
            <p className="text-lg mb-1" style={{ color: "var(--text-muted)" }}>
              Let&apos;s build your{" "}
              <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>
                mentorship profile.
              </span>
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Upload your resume and share your goals — our AI handles the rest.
            </p>
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="relative w-full rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer mb-8"
            style={{
              minHeight: "220px",
              borderColor: isDragging ? "var(--accent)" : uploadedFile ? "var(--success)" : "var(--border)",
              backgroundColor: isDragging ? "var(--accent-light)" : uploadedFile ? "var(--success-light)" : "var(--bg-surface)",
            }}
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
                  <div className="w-16 h-16 flex items-center justify-center rounded-full mb-4" style={{ backgroundColor: "var(--success-light)" }}>
                    <i className="ri-file-check-line text-3xl" style={{ color: "var(--success)" }} />
                  </div>
                  <p className="font-semibold text-lg" style={{ color: "var(--success)" }}>{uploadedFile.name}</p>
                  <p className="text-sm mt-1" style={{ color: "var(--success)" }}>Resume uploaded successfully</p>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                    className="mt-3 text-xs underline cursor-pointer"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Remove file
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 flex items-center justify-center rounded-full mb-4 transition-all" style={{ backgroundColor: isDragging ? "var(--accent-light)" : "var(--bg-elevated)" }}>
                    <i className={`ri-upload-cloud-2-line text-3xl transition-all`} style={{ color: isDragging ? "var(--accent)" : "var(--text-muted)" }} />
                  </div>
                  <p className="font-semibold text-lg mb-1" style={{ color: "var(--text-primary)" }}>
                    {isDragging ? "Drop it here!" : "Drag your resume here"}
                  </p>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>or click to browse — PDF only</p>
                  <div className="mt-4 px-4 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}>
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
                <i className="ri-sparkling-2-line text-base" style={{ color: "var(--accent)" }} />
              </div>
              <input
                type="text"
                value={dreamRole}
                onChange={(e) => setDreamRole(e.target.value)}
                placeholder="What is your dream role?"
                className="w-full pl-11 pr-4 py-4 rounded-xl border text-sm focus:outline-none transition-all"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
            <div className="relative">
              <div className="absolute left-4 top-4 w-5 h-5 flex items-center justify-center">
                <i className="ri-focus-3-line text-base" style={{ color: "var(--accent)" }} />
              </div>
              <textarea
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                placeholder="What is your biggest current challenge?"
                rows={3}
                className="w-full pl-11 pr-4 py-4 rounded-xl border text-sm focus:outline-none transition-all resize-none"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-5 rounded-xl text-white font-bold text-base transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-3 whitespace-nowrap cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(to right, var(--accent), var(--accent))" }}
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

          <p className="text-center text-xs mt-4" style={{ color: "var(--text-muted)" }}>
            Your data is private and never shared without your consent.
          </p>
        </div>
      </main>
    </div>
  );
}
