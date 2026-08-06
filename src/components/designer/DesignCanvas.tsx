"use client";

import { useEffect, useRef } from "react";
import { Canvas, FabricImage, FabricText, type FabricObject } from "fabric";

type Props = {
  garmentUrl: string;
  width?: number;
  height?: number;
  onReady?: (api: DesignCanvasApi) => void;
  onChange?: (json: string) => void;
};

export type DesignCanvasApi = {
  addText: () => void;
  addImageFile: (file: File) => Promise<void>;
  bringForward: () => void;
  sendBack: () => void;
  deleteSelected: () => void;
  loadJson: (json: string) => Promise<void>;
  toJSON: () => string;
  toDataURL: () => string;
  getCanvas: () => Canvas | null;
};

export function DesignCanvas({
  garmentUrl,
  width = 520,
  height = 640,
  onReady,
  onChange,
}: Props) {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<Canvas | null>(null);
  const printAreaRef = useRef<{ left: number; top: number; width: number; height: number }>({
    left: 160,
    top: 180,
    width: 200,
    height: 240,
  });

  useEffect(() => {
    if (!canvasEl.current) return;

    const canvas = new Canvas(canvasEl.current, {
      width,
      height,
      backgroundColor: "#f3efe6",
      preserveObjectStacking: true,
      selection: true,
    });
    canvasRef.current = canvas;

    const emit = () => onChange?.(JSON.stringify(canvas.toJSON()));
    canvas.on("object:modified", emit);
    canvas.on("object:added", emit);
    canvas.on("object:removed", emit);

    const api: DesignCanvasApi = {
      addText: () => {
        const text = new FabricText("GoodLuck", {
          left: printAreaRef.current.left + 20,
          top: printAreaRef.current.top + 40,
          fontFamily: "Source Sans 3, Arial, sans-serif",
          fontSize: 28,
          fill: "#1c1a17",
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.requestRenderAll();
      },
      addImageFile: async (file) => {
        const dataUrl = await fileToDataUrl(file);
        const img = await FabricImage.fromURL(dataUrl, { crossOrigin: "anonymous" });
        const maxW = printAreaRef.current.width * 0.85;
        const scale = Math.min(1, maxW / (img.width || maxW));
        img.set({
          left: printAreaRef.current.left + 20,
          top: printAreaRef.current.top + 40,
          scaleX: scale,
          scaleY: scale,
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.requestRenderAll();
      },
      bringForward: () => {
        const obj = canvas.getActiveObject();
        if (obj) {
          canvas.bringObjectForward(obj);
          canvas.requestRenderAll();
        }
      },
      sendBack: () => {
        const obj = canvas.getActiveObject();
        if (obj) {
          canvas.sendObjectBackwards(obj);
          canvas.requestRenderAll();
        }
      },
      deleteSelected: () => {
        const objs = canvas.getActiveObjects();
        objs.forEach((obj: FabricObject) => {
          if ((obj as FabricObject & { isGarment?: boolean }).isGarment) return;
          canvas.remove(obj);
        });
        canvas.discardActiveObject();
        canvas.requestRenderAll();
      },
      loadJson: async (json) => {
        await canvas.loadFromJSON(json);
        canvas.requestRenderAll();
      },
      toJSON: () => JSON.stringify(canvas.toJSON()),
      toDataURL: () => canvas.toDataURL({ format: "png", multiplier: 1.5 }),
      getCanvas: () => canvasRef.current,
    };

    onReady?.(api);

    return () => {
      canvas.dispose();
      canvasRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;

    (async () => {
      const existing = canvas
        .getObjects()
        .find((o) => (o as FabricObject & { isGarment?: boolean }).isGarment);
      if (existing) canvas.remove(existing);

      const img = await FabricImage.fromURL(garmentUrl, { crossOrigin: "anonymous" });
      if (cancelled) return;

      const scale = Math.min(width / (img.width || width), height / (img.height || height));
      img.set({
        left: 0,
        top: 0,
        scaleX: scale,
        scaleY: scale,
        selectable: false,
        evented: false,
      });
      (img as FabricObject & { isGarment?: boolean }).isGarment = true;
      canvas.insertAt(0, img);
      canvas.requestRenderAll();
    })();

    return () => {
      cancelled = true;
    };
  }, [garmentUrl, width, height]);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[#f3efe6] shadow-sm">
      <canvas ref={canvasEl} />
    </div>
  );
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
