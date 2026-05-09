"use client";

import { memo, useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUploadHistory,
  uploadFile,
  clearUploadError,
} from "../../redux/slices/uploadHistorySlice.js";
import {
  FileUp,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const UploadDataPageContent = memo(function UploadDataPageContent() {
  const dispatch = useDispatch();
  const {
    history,
    pagination,
    historyLoading,
    historyError,
    uploading,
    uploadError,
  } = useSelector((state) => state.uploadHistory);

  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchUploadHistory({ page: 1 }));
  }, [dispatch]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setSelectedFile(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    dispatch(clearUploadError());
  };

  const handleUpload = async () => {
    if (!selectedFile || uploading) return;
    await dispatch(uploadFile(selectedFile));
    clearFile();
  };

  const handlePage = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages || historyLoading)
      return;
    dispatch(fetchUploadHistory({ page: newPage }));
  };

  const formatDate = (iso) => new Date(iso).toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Upload Data</h2>

      {/* Drop Zone */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
            dragOver ? "border-purple-500 bg-purple-50" : "border-gray-300"
          }`}>
          <div className="flex flex-col items-center justify-center space-y-4">
            <FileUp
              size={48}
              className={dragOver ? "text-purple-500" : "text-gray-400"}
            />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Upload File
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Drag and drop your CSV or XLSX file here, or click to select
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 cursor-pointer py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Select File
            </button>
          </div>
        </div>

        {uploadError && (
          <div className="flex items-center gap-2 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            <AlertCircle size={15} /> {uploadError}
          </div>
        )}

        {selectedFile && (
          <div className="mt-4 flex items-center justify-between bg-purple-50 border border-purple-200 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-purple-800">
              <FileUp size={16} />
              <span className="font-medium">{selectedFile.name}</span>
              <span className="text-purple-400">
                ({(selectedFile.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearFile}
                className="text-gray-400 cursor-pointer hover:text-gray-600">
                <X size={16} />
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex cursor-pointer items-center gap-2 px-4 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" /> Uploading...
                  </span>
                ) : (
                  "Upload"
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/*  History Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">
            Upload History
          </h3>
          {historyLoading && (
            <Loader2 size={16} className="animate-spin text-purple-500" />
          )}
        </div>

        {historyError && (
          <div className="flex items-center gap-2 mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            <AlertCircle size={15} /> Failed to load history: {historyError}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="text-left px-6 py-3">File Name</th>
                <th className="text-left px-6 py-3">Type</th>
                <th className="text-left px-6 py-3">Date</th>
                <th className="text-left px-6 py-3">Records</th>
                <th className="text-left px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {historyLoading && history.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    <Loader2 size={20} className="animate-spin mx-auto mb-2" />
                    Loading history...
                  </td>
                </tr>
              )}
              {!historyLoading && history.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    No uploads yet.
                  </td>
                </tr>
              )}
              {history.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {entry.fileName}
                  </td>
                  <td className="px-6 py-4 text-gray-500 uppercase text-xs tracking-wide">
                    {entry.fileType}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatDate(entry.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {entry.status === "success"
                      ? entry.totalRecords.toLocaleString()
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    {entry.status === "success" && (
                      <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded-full text-xs font-medium">
                        <CheckCircle size={12} /> Success
                      </span>
                    )}
                    {entry.status === "pending" && (
                      <span className="inline-flex items-center gap-1 text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-full text-xs font-medium">
                        <Loader2 size={12} className="animate-spin" /> Pending
                      </span>
                    )}
                    {entry.status === "error" && (
                      <span
                        title={entry.errorMessage || ""}
                        className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2 py-0.5 rounded-full text-xs font-medium">
                        <AlertCircle size={12} /> Failed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 text-sm text-gray-600">
            <span>
              Page <strong>{pagination.currentPage}</strong> of{" "}
              <strong>{pagination.totalPages}</strong> ·{" "}
              {pagination.totalRecords.toLocaleString()} total uploads
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePage(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1 || historyLoading}
                className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft size={16} />
              </button>

              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  const start = Math.max(
                    1,
                    Math.min(
                      pagination.currentPage - 2,
                      pagination.totalPages - 4,
                    ),
                  );
                  const p = start + i;
                  return (
                    <button
                      key={p}
                      onClick={() => handlePage(p)}
                      disabled={historyLoading}
                      className={`w-8 h-8 cursor-pointer rounded-md text-xs font-medium transition-colors ${
                        p === pagination.currentPage
                          ? "bg-purple-600 text-white"
                          : "border border-gray-200 hover:bg-gray-50 text-gray-600"
                      }`}>
                      {p}
                    </button>
                  );
                },
              )}

              <button
                onClick={() => handlePage(pagination.currentPage + 1)}
                disabled={
                  pagination.currentPage === pagination.totalPages ||
                  historyLoading
                }
                className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
