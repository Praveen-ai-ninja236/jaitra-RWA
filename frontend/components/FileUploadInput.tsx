"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Trash2, Eye, ExternalLink } from "lucide-react";

interface FileUploadInputProps {
  label?: string;
  value?: string; // base64 string or file URL
  onChange: (fileDataUrl: string, fileName: string) => void;
  required?: boolean;
  helpText?: string;
}

export default function FileUploadInput({
  label = "Upload Bill / Invoice / Document",
  value = "",
  onChange,
  required = false,
  helpText = "Upload PDF, PNG, JPG, or Invoice receipts (Max 5MB)",
}: FileUploadInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus("error");
      setStatusMessage("File size exceeds 5MB limit. Please upload a smaller file.");
      return;
    }

    const sizeInKB = (file.size / 1024).toFixed(1) + " KB";
    setFileName(file.name);
    setFileSize(sizeInKB);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onChange(result, file.name);
      setUploadStatus("success");
      setStatusMessage(`"${file.name}" attached successfully (${sizeInKB})`);
    };
    reader.onerror = () => {
      setUploadStatus("error");
      setStatusMessage("Failed to read file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("", "");
    setFileName("");
    setFileSize("");
    setUploadStatus("idle");
    setStatusMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-slate-300">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}

      {/* File Drop / Trigger Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-3.5 flex flex-col items-center justify-center text-center cursor-pointer transition ${
          value || uploadStatus === "success"
            ? "border-emerald-600/70 bg-emerald-950/20 hover:bg-emerald-950/30"
            : uploadStatus === "error"
            ? "border-red-600/70 bg-red-950/20"
            : "border-slate-700 hover:border-sky-500 bg-slate-800/60 hover:bg-slate-800"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
          className="hidden"
        />

        {value || fileName ? (
          <div className="w-full flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">
                  {fileName || (value.startsWith("data:") ? "Attached Document" : value)}
                </p>
                {fileSize && <p className="text-[11px] text-emerald-400 font-mono">{fileSize}</p>}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {value && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPreviewOpen(true);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 text-xs flex items-center gap-1 font-semibold"
                  title="Preview / Download"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">View</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 border border-slate-700"
                title="Remove attachment"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-1">
            <UploadCloud className="w-7 h-7 text-sky-400 mb-1.5 animate-bounce" />
            <p className="text-xs font-semibold text-slate-200">
              Click to browse or drag & drop invoice / bill
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">{helpText}</p>
          </div>
        )}
      </div>

      {/* Success / Error Message Banner */}
      {statusMessage && (
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium animate-fadeIn ${
            uploadStatus === "success"
              ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/60"
              : "bg-red-950/60 text-red-300 border border-red-800/60"
          }`}
        >
          {uploadStatus === "success" ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
          )}
          <span className="truncate">{statusMessage}</span>
        </div>
      )}

      {/* Document Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" /> Attached Bill / Document Preview
              </h3>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg"
              >
                Close
              </button>
            </div>

            <div className="max-h-[60vh] overflow-auto flex items-center justify-center p-2 bg-slate-950 rounded-xl border border-slate-800">
              {value && value.startsWith("data:image") ? (
                <img src={value} alt="Bill Preview" className="max-h-[50vh] max-w-full rounded-lg object-contain" />
              ) : value && value.startsWith("data:application/pdf") ? (
                <iframe src={value} className="w-full h-[50vh] rounded-lg" title="PDF Preview" />
              ) : (
                <div className="py-8 text-center space-y-3">
                  <FileText className="w-12 h-12 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-300 font-mono">{fileName || value}</p>
                  <a
                    href={value}
                    download={fileName || "attachment"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition shadow-md"
                  >
                    <ExternalLink className="w-4 h-4" /> Download / Open File
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
