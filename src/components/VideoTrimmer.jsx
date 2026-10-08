import React, { useRef, useState } from 'react';
import { Clock, Scissors, RotateCcw, Play, Camera, Image as ImageIcon } from 'lucide-react';

export default function VideoTrimmer({
  videoPreviewUrl,
  videoSizeMb,
  videoTrimStart,
  setVideoTrimStart,
  videoTrimEnd,
  setVideoTrimEnd,
  videoPosterPreview,
  setVideoPosterPreview,
  onRemoveVideo,
  onVideoPosterChange
}) {
  const videoRef = useRef(null);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  const handleSetTrimStart = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    setVideoTrimStart(current.toFixed(1));
    if (videoTrimEnd && parseFloat(videoTrimEnd) <= current) {
      setVideoTrimEnd('');
    }
  };

  const handleSetTrimEnd = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    if (videoTrimStart && parseFloat(videoTrimStart) >= current) {
      alert('अंतिम समय शुरू के समय से अधिक होना चाहिए।');
      return;
    }
    setVideoTrimEnd(current.toFixed(1));
  };

  const handlePreviewTrim = () => {
    if (!videoRef.current) return;
    const start = parseFloat(videoTrimStart) || 0;
    const end = parseFloat(videoTrimEnd) || videoDuration;
    videoRef.current.currentTime = start;
    videoRef.current.play();

    const checkInterval = setInterval(() => {
      if (videoRef.current && videoRef.current.currentTime >= end) {
        videoRef.current.pause();
        clearInterval(checkInterval);
      }
    }, 100);
  };

  const handleResetTrim = () => {
    setVideoTrimStart('');
    setVideoTrimEnd('');
  };

  const handleCaptureThumbnail = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setVideoPosterPreview(dataUrl);
  };

  return (
    <div className="space-y-4 bg-gray-50 dark:bg-gray-850 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
      {/* Video Player */}
      <div className="relative rounded-xl overflow-hidden bg-black shadow-md border border-gray-800">
        <video
          ref={videoRef}
          crossOrigin="anonymous"
          src={videoPreviewUrl}
          controls
          playsInline
          onTimeUpdate={(e) => setVideoCurrentTime(e.target.currentTime)}
          onLoadedMetadata={(e) => setVideoDuration(e.target.duration)}
          className="w-full max-h-60 object-contain mx-auto"
        />
        <button
          type="button"
          onClick={onRemoveVideo}
          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full text-xs shadow-lg transition"
          title="वीडियो हटाएं"
        >
          ✕
        </button>
      </div>

      {/* Live Playback Timer & Status */}
      <div className="flex items-center justify-between text-xs font-mono text-gray-600 dark:text-gray-300 px-1">
        <div className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white font-hindi">
          <Clock className="w-3.5 h-3.5 text-red-600" />
          <span>वर्तमान समय: {videoCurrentTime.toFixed(1)}s / {videoDuration.toFixed(1)}s</span>
        </div>
        <span className="text-[11px] text-gray-500 font-hindi">
          आकार: {videoSizeMb ? `${videoSizeMb} MB` : 'तैयार'}
        </span>
      </div>

      {/* ✂️ VIDEO TRIMMER & FRAME CAPTURE TOOLBAR */}
      <div className="p-3.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold font-hindi text-gray-900 dark:text-white flex items-center gap-1.5">
            <Scissors className="w-3.5 h-3.5 text-red-600" />
            <span>वीडियो ट्रिम टूल (Video Trimming & Capture)</span>
          </span>
          {(videoTrimStart || videoTrimEnd) && (
            <button
              type="button"
              onClick={handleResetTrim}
              className="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>रीसेट ट्रिम</span>
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={handleSetTrimStart}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-950/40 text-gray-800 dark:text-gray-200 hover:text-red-600 rounded-xl text-xs font-bold transition border border-gray-200 dark:border-gray-600 active:scale-95"
            title="वर्तमान वीडियो स्थिति को शुरू का समय बनाएं"
          >
            <Scissors className="w-3.5 h-3.5 text-red-600" />
            <span>शुरू: {videoTrimStart ? `${videoTrimStart}s` : 'सेट करें'}</span>
          </button>

          <button
            type="button"
            onClick={handleSetTrimEnd}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-950/40 text-gray-800 dark:text-gray-200 hover:text-red-600 rounded-xl text-xs font-bold transition border border-gray-200 dark:border-gray-600 active:scale-95"
            title="वर्तमान वीडियो स्थिति को अंतिम समय बनाएं"
          >
            <Scissors className="w-3.5 h-3.5 text-red-600 rotate-180" />
            <span>अंत: {videoTrimEnd ? `${videoTrimEnd}s` : 'सेट करें'}</span>
          </button>

          <button
            type="button"
            onClick={handlePreviewTrim}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-bold transition border border-blue-200 dark:border-blue-900 active:scale-95"
            title="ट्रिम किया हुआ भाग चलाकर देखें"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>ट्रिम चलाएं</span>
          </button>

          <button
            type="button"
            onClick={handleCaptureThumbnail}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-sm transition active:scale-95"
            title="वर्तमान फ्रेम को थंबनेल / कवर फोटो बनाएं"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>फ्रेम थंबनेल बनाएं</span>
          </button>
        </div>

        {(videoTrimStart || videoTrimEnd) && (
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-between font-hindi">
            <span>✓ ट्रिम सक्रिय: {videoTrimStart || 0}s से {videoTrimEnd || `${videoDuration.toFixed(1)}s`} तक</span>
            <span>अवधि: {((parseFloat(videoTrimEnd || videoDuration) - parseFloat(videoTrimStart || 0))).toFixed(1)}s</span>
          </div>
        )}
      </div>

      {/* Thumbnail Cover Photo Preview */}
      <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 rounded-lg text-xs font-bold cursor-pointer transition">
          <ImageIcon className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
          <span>कस्टम कवर फोटो अपलोड करें (वैकल्पिक)</span>
          <input
            type="file"
            accept="image/*"
            onChange={onVideoPosterChange}
            className="hidden"
          />
        </label>
        {videoPosterPreview && (
          <div className="flex items-center gap-2">
            <img src={videoPosterPreview} alt="" className="w-12 h-9 object-cover rounded-lg border shadow-sm" />
            <span className="text-xs text-emerald-600 font-bold">
              ✓ थंबनेल सेट है
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
