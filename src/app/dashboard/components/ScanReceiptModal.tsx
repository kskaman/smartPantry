"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Camera, RotateCcw, Check } from "lucide-react";

interface ScanReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScanReceiptModal({ isOpen, onClose }: ScanReceiptModalProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  }, [stream]);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      setError("");
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      setStream(mediaStream);
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch {
      setError("Unable to access camera. Please check permissions.");
    }
  }, []);

  // Capture image from video
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setCapturedImage(imageDataUrl);
        stopCamera();
      }
    }
  };

  // Retake photo
  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Confirm and process image
  const confirmImage = () => {
    if (capturedImage) {
      // TODO: Process the image (send to OCR API, etc.)
      console.log("Image captured:", capturedImage.substring(0, 50) + "...");

      // For now, just close the modal
      handleClose();
    }
  };

  // Handle modal close
  const handleClose = () => {
    stopCamera();
    setCapturedImage(null);
    setError("");
    setIsCameraActive(false);
    onClose();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Auto-start camera when modal opens
  useEffect(() => {
    if (isOpen && !isCameraActive && !capturedImage) {
      // Use setTimeout to avoid calling setState directly in effect
      const timer = setTimeout(() => startCamera(), 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isCameraActive, capturedImage, startCamera]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Scan Receipt</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="relative bg-black rounded-lg overflow-hidden">
            {!capturedImage ? (
              <>
                {/* Camera View */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-auto max-h-[60vh] object-contain"
                />

                {/* Camera Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 border-2 border-white/30 m-8 rounded-lg" />
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                    Position receipt within frame
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Captured Image Preview */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={capturedImage}
                  alt="Captured receipt"
                  className="w-full h-auto max-h-[60vh] object-contain"
                />
              </>
            )}
          </div>

          {/* Hidden canvas for capturing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Controls */}
          <div className="flex gap-3 justify-center">
            {!capturedImage ? (
              <>
                {isCameraActive && (
                  <Button
                    onClick={captureImage}
                    size="lg"
                    className="rounded-full w-16 h-16 p-0"
                  >
                    <Camera className="h-6 w-6" />
                  </Button>
                )}
                {!isCameraActive && !error && (
                  <Button onClick={startCamera} size="lg">
                    <Camera className="h-5 w-5 mr-2" />
                    Start Camera
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button onClick={retakePhoto} variant="outline" size="lg">
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Retake
                </Button>
                <Button onClick={confirmImage} size="lg">
                  <Check className="h-5 w-5 mr-2" />
                  Use This Photo
                </Button>
              </>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
