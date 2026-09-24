
import React, { useCallback, useRef, useState } from "react";
import { useAnalysis } from "./hooks/useAnalysis.js";
import { useTheme } from "./theme/ThemeProvider.jsx";

import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  Clock3,
  CloudUpload,
  FileImage,
  FolderKanban,
  Gauge,
  Image as ImageIcon,
  Layers3,
  Menu,
  MoreHorizontal,
  PanelLeftClose,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: BarChart3 },
  { label: "New analysis", icon: Sparkles },
  {
    label: "Workspace",
    icon: Layers3,
    children: ["Upload image", "Processing", "Results"],
  },
  {
    label: "Projects",
    icon: FolderKanban,
    children: ["Recent analysis"],
  },
];

function ThemeSelector() {
  const { mode, setMode } = useTheme();

  return (
    <label className="theme-selector">
      <span>Appearance</span>

      <select
        value={mode}
        onChange={(event) => setMode(event.target.value)}
        aria-label="Choose appearance"
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  );
}

function App() {
  const [activeNav, setActiveNav] = useState("New analysis");
  const [page, setPage] = useState("input");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [dragging, setDragging] = useState(false);

  const inputRef = useRef(null);

  const {
    file,
    preview,
    inputResolution,
    targetResolution,
    capabilities,
    status,
    error,
    isConfigurationValid,
    selectFile,
    replaceFile,
    removeFile,
    updateInputResolution,
    updateTargetResolution,
    submitAnalysis,
    resetAnalysis,
    setError,
  } = useAnalysis();

  const handleSelectedFile = useCallback(
    (selected) => {
      if (!selected) return;

      setError("");
      selectFile(selected);
    },
    [selectFile, setError]
  );

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      setDragging(false);
      handleSelectedFile(event.dataTransfer.files?.[0]);
    },
    [handleSelectedFile]
  );

  const handleReset = useCallback(() => {
    resetAnalysis();
    setPage("input");
    setActiveNav("New analysis");
    setMobileNavOpen(false);
    setDragging(false);
  }, [resetAnalysis]);

  const handleSubmit = useCallback(() => {
    const accepted = submitAnalysis();

    // Move to processing only when the workflow accepts the submission.
    // The hook must not report success until the backend confirms it.
    if (accepted) {
      setPage("processing");
      setActiveNav("Workspace");
    }
  }, [submitAnalysis]);

  const handleNavigation = (label) => {
    setActiveNav(label);

    if (label === "New analysis") {
      setPage("input");
    } else if (label === "Workspace") {
      setPage(status === "processing" ? "processing" : "results");
    }

    setMobileNavOpen(false);
  };

  const pageTitle =
    page === "input"
      ? "New analysis"
      : page === "processing"
        ? "Processing imagery"
        : "Analysis results";

  const pageDescription =
    page === "input"
      ? "Upload a Sentinel-2 image and configure your output resolution."
      : page === "processing"
        ? "Your imagery is being prepared for super-resolution mapping."
        : "Review the output summary and your source imagery.";

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className="icon-button mobile-menu"
          aria-label="Open navigation"
          onClick={() => setMobileNavOpen((open) => !open)}
        >
          <Menu size={20} />
        </button>

        <button
          className="brand"
          onClick={handleReset}
          aria-label="SAARAS-X home"
        >
          <span className="brand-mark">
            <span />
            <span />
            <span />
            <span />
          </span>

          <span className="brand-copy">
            <strong>SAARAS-X</strong>
            <small>Super Resolution Mapping</small>
          </span>
        </button>

        <div className="topbar-right">
          <ThemeSelector />

  <span className="status-pill">
    <span className="status-dot" />
    Workspace ready
  </span>

          <button
            className="top-link"
            onClick={() => handleNavigation("Projects")}
          >
            Projects
          </button>

          <button
            className="top-link"
            onClick={() => handleNavigation("History")}
          >
            History
          </button>

          <button
            className="top-link"
            onClick={() => handleNavigation("Settings")}
          >
            Settings
          </button>

          <button className="avatar" aria-label="Account menu">
            R
          </button>
        </div>
      </header>

      <div className="body-layout">
        <aside
          className={`sidebar ${mobileNavOpen ? "sidebar-open" : ""}`}
        >
          <div className="sidebar-heading">
            <span>WORKSPACE</span>

            <button
              className="icon-button collapse-button"
              aria-label="Close navigation"
              onClick={() => setMobileNavOpen(false)}
            >
              <PanelLeftClose size={17} />
            </button>
          </div>

          <nav aria-label="Main navigation">
            {navItems.map(({ label, icon: Icon, children }) => (
              <div key={label}>
                <button
                  className={`nav-item ${
                    activeNav === label ? "active" : ""
                  }`}
                  onClick={() => handleNavigation(label)}
                >
                  <Icon size={17} />
                  <span>{label}</span>
                  {children && (
                    <ChevronDown className="nav-chevron" size={15} />
                  )}
                </button>

                {children && (
                  <div className="subnav">
                    {children.map((child) => {
                      const childPage =
                        child === "Upload image"
                          ? "input"
                          : child === "Processing"
                            ? "processing"
                            : "results";

                      const isActive = page === childPage;

                      return (
                        <button
                          key={child}
                          className={`subnav-item ${
                            isActive ? "sub-active" : ""
                          }`}
                          onClick={() => {
                            setActiveNav("Workspace");
                            setPage(childPage);
                            setMobileNavOpen(false);
                          }}
                        >
                          <span className="subnav-bullet" />
                          {child}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="sidebar-bottom">
            <div className="usage-card">
              <div className="usage-icon">
                <Gauge size={17} />
              </div>

              <div>
                <strong>Analysis workspace</strong>
                <p>Prepare imagery and run a super-resolution job.</p>
              </div>
            </div>

            <div className="user-row">
              <div className="user-avatar">R</div>

              <div className="user-meta">
                <strong>Researcher</strong>
                <small>Free workspace</small>
              </div>

              <MoreHorizontal size={18} />
            </div>
          </div>
        </aside>

        {mobileNavOpen && (
          <button
            className="scrim"
            aria-label="Close navigation overlay"
            onClick={() => setMobileNavOpen(false)}
          />
        )}

        <main className="main-content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                <span>WORKSPACE</span>
                <span className="crumb-slash">/</span>
                <span>{page === "input" ? "NEW ANALYSIS" : page.toUpperCase()}</span>
              </div>

              <h1>{pageTitle}</h1>
              <p>{pageDescription}</p>
            </div>

            <button className="secondary-button" onClick={handleReset}>
              <RotateCcw size={15} />
              Start over
            </button>
          </div>

          {page === "input" && (
            <div className="content-grid">
              <section className="panel input-panel">
                <div className="panel-heading">
                  <div className="panel-title-icon">
                    <CloudUpload size={19} />
                  </div>

                  <div>
                    <h2>Upload satellite image</h2>
                    <p>Choose the source image for your analysis.</p>
                  </div>

                  <span className="step-tag">STEP 01</span>
                </div>

                <div
                  className={`dropzone ${dragging ? "dragging" : ""} ${
                    file ? "has-file" : ""
                  }`}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".tif,.tiff,.png,.jpg,.jpeg"
                    hidden
                    onChange={(event) => {
                      handleSelectedFile(event.target.files?.[0]);

                      // Allow the same file to be selected again.
                      event.target.value = "";
                    }}
                  />

                  {file ? (
                    <div className="file-selected">
                      <div className="file-icon">
                        <FileImage size={24} />
                      </div>

                      <div className="file-details">
                        <strong>{file.name}</strong>
                        <span>
                          {(file.size / (1024 * 1024)).toFixed(2)} MB · Image
                          selected
                        </span>
                      </div>

                      <button
                        className="icon-button remove-file"
                        aria-label="Remove selected image"
                        onClick={removeFile}
                      >
                        <X size={17} />
                      </button>

                      <button
                        className="secondary-button"
                        onClick={() => inputRef.current?.click()}
                      >
                        Replace
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="upload-illustration">
                        <CloudUpload size={27} />
                      </div>

                      <h3>Drop your Sentinel-2 image here</h3>
                      <p>or browse files from your device</p>

                      <button
                        className="browse-button"
                        onClick={() => inputRef.current?.click()}
                      >
                        <FolderKanban size={15} />
                        Browse files
                      </button>

                      <span className="file-hint">
                        Image formats · Maximum file size 100 MB
                      </span>
                    </>
                  )}
                </div>

                {preview && (
                  <div className="preview-strip">
                    <img
                      src={preview}
                      alt="Selected satellite image preview"
                    />

                    <div>
                      <strong>Image preview</strong>
                      <span>
                        Local preview only — the source file has not
                        necessarily been uploaded to a server.
                      </span>
                    </div>
                  </div>
                )}

                <div className="form-divider" />

                <div className="panel-heading config-heading">
                  <div className="panel-title-icon muted">
                    <SlidersHorizontal size={18} />
                  </div>

                  <div>
                    <h2>Resolution settings</h2>
                    <p>
                      Set the source and desired output ground sampling
                      distance.
                    </p>
                  </div>

                  <span className="step-tag">STEP 02</span>
                </div>

                <div className="resolution-grid">
                  <label className="field">
                    <span>
                      Input resolution <i>Source</i>
                    </span>

                    <div className="input-with-unit">
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={inputResolution}
                        onChange={(event) =>
                          updateInputResolution(event.target.value)
                        }
                      />
                      <span>m / pixel</span>
                    </div>

                    <small>Current ground sampling distance</small>
                  </label>

                  <label className="field">
                    <span>
                      Target resolution <i>Output</i>
                    </span>

                    <div className="input-with-unit">
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={targetResolution}
                        onChange={(event) =>
                          updateTargetResolution(event.target.value)
                        }
                      />
                      <span>m / pixel</span>
                    </div>

                    <small>Desired output ground sampling distance</small>
                  </label>
                </div>

                <div className="info-note">
                  <ShieldCheck size={17} />
                  <p>
                    For super-resolution, the target resolution should be a
                    smaller number than the input resolution. The actual
                    supported combinations depend on the model and source
                    data.
                  </p>
                </div>

                {error && (
                  <div className="error-message" role="alert">
                    {error}
                  </div>
                )}

                <div className="panel-footer">
                  <span>
                    <span className="required-dot" />
                    Required fields
                  </span>

                  <button
                    className="primary-button"
                    disabled={!isConfigurationValid}
                    onClick={handleSubmit}
                  >
                    Continue to processing
                    <ArrowRight size={17} />
                  </button>
                </div>
              </section>

              <aside className="right-rail">
                <section className="panel summary-panel">
                  <div className="rail-heading">
                    <h2>Analysis overview</h2>
                    <span className="live-tag">DRAFT</span>
                  </div>

                  <div className="summary-row">
                    <span className="summary-icon">
                      <ImageIcon size={17} />
                    </span>
                    <div>
                      <small>Source imagery</small>
                      <strong>
                        {file ? "1 image selected" : "No image uploaded"}
                      </strong>
                    </div>
                  </div>

                  <div className="summary-row">
                    <span className="summary-icon">
                      <Gauge size={17} />
                    </span>
                    <div>
                      <small>Input resolution</small>
                      <strong>{inputResolution || "—"} m / pixel</strong>
                    </div>
                  </div>

                  <div className="summary-row">
                    <span className="summary-icon">
                      <Sparkles size={17} />
                    </span>
                    <div>
                      <small>Target resolution</small>
                      <strong>{targetResolution || "—"} m / pixel</strong>
                    </div>
                  </div>

                  <div className="summary-divider" />

                  <div className="summary-status">
                    <span className="status-ring">
                      <Check size={13} />
                    </span>
                    <span>Ready to configure</span>
                  </div>
                </section>

                <section className="help-card">
                  <div className="help-symbol">
                    <Activity size={19} />
                  </div>

                  <h3>About super-resolution</h3>

                  <p>
                    Super-resolution models estimate finer spatial detail
                    from lower-resolution imagery. Results should be
                    validated before scientific or operational use.
                  </p>

                  <button onClick={() => handleNavigation("Settings")}>
                    View workflow guide <ArrowRight size={14} />
                  </button>
                </section>

                <div className="privacy-note">
                  <ShieldCheck size={15} />
                  <span>
                    The selected file is handled by the current frontend
                    workflow. Whether it is sent to a server depends on the
                    configured submission process.
                  </span>
                </div>
              </aside>
            </div>
          )}

          {page === "processing" && (
            <section className="panel process-panel">
              <div className="processing-orb">
                <Activity size={28} />
              </div>

              <span className="eyebrow">ANALYSIS JOB</span>

              <h2>
                {status === "processing"
                  ? "Processing your analysis…"
                  : "Analysis has not started"}
              </h2>

              <p>
                The frontend workflow is prepared for inference integration.
                A real processing status requires a confirmed backend job.
              </p>

              <div className="progress-track">
                <span
                  className={
                    status === "processing" ? "progress-active" : ""
                  }
                />
              </div>

              <div className="process-steps">
                <div className="process-step done">
                  <Check size={15} />
                  <span>Image selected</span>
                </div>

                <div
                  className={`process-step ${
                    status === "processing" ? "current" : ""
                  }`}
                >
                  <Activity size={15} />
                  <span>Run model inference</span>
                </div>

                <div className="process-step">
                  <Clock3 size={15} />
                  <span>Prepare result assets</span>
                </div>
              </div>

              {error && (
                <div className="error-message" role="alert">
                  {error}
                </div>
              )}

              <button className="secondary-button" onClick={handleReset}>
                Return to setup
              </button>
            </section>
          )}

          {page === "results" && (
            <div className="results-layout">
              <section className="panel results-panel">
                <div className="panel-heading">
                  <div className="panel-title-icon">
                    <Layers3 size={18} />
                  </div>

                  <div>
                    <h2>Output preview</h2>
                    <p>
                      {status === "success"
                        ? "The workflow reports success. Display a model output only when the result asset is available."
                        : "No confirmed model output is available yet."}
                    </p>
                  </div>

                  <span className="step-tag">
                    {status === "success" ? "JOB SUCCESS" : "AWAITING RUN"}
                  </span>
                </div>

                <div className="result-canvas">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Source image preview; this is not a model output"
                    />
                  ) : (
                    <div className="empty-result">
                      <div>
                        <ImageIcon size={30} />
                      </div>
                      <strong>No output image</strong>
                      <span>
                        Upload an image and connect the inference service to
                        view generated results.
                      </span>
                    </div>
                  )}

                  <span className="canvas-label">
                    {preview ? "SOURCE IMAGE · PREVIEW" : "RESULT VIEWER"}
                  </span>
                </div>

                <div className="result-bottom">
                  <span>
                    <span className="status-dot" />
                    {status === "success"
                      ? "Job reported successful"
                      : "Waiting for inference output"}
                  </span>

                  <button className="primary-button" onClick={handleReset}>
                    New analysis <ArrowRight size={16} />
                  </button>
                </div>
              </section>

              <aside className="panel metrics-panel">
                <h2>Run summary</h2>

                <div className="metric">
                  <span>Status</span>
                  <strong>{status || "Not started"}</strong>
                </div>

                <div className="metric">
                  <span>Input resolution</span>
                  <strong>{inputResolution || "—"} m / px</strong>
                </div>

                <div className="metric">
                  <span>Target resolution</span>
                  <strong>{targetResolution || "—"} m / px</strong>
                </div>

                <div className="metric">
                  <span>Source file</span>
                  <strong className="filename">{file?.name || "—"}</strong>
                </div>

                <div className="summary-divider" />

                <p className="metrics-disclaimer">
                  This interface does not produce scientific output on its
                  own. Connect the trained model/API to populate this panel
                  with verified results and metadata.
                </p>

                <button
                  className="secondary-button full-button"
                  onClick={() => setPage("input")}
                >
                  <ArrowLeft size={15} />
                  Back to configuration
                </button>
              </aside>
            </div>
          )}

          <footer className="footer">
            <span>© 2025 SAARAS-X · Super Resolution Mapping</span>
            <span>
              <span className="footer-dot" />
              Prototype workspace
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;