"use client";

import { useEffect, useRef } from "react";
import { Canvas, FabricImage, FabricText, type FabricObject } from "fabric";

type Props = {
  garmentUrl: string;
  width?: number;
  height?: number;
  initialPhrase?: string;
  onReady?: (api: DesignCanvasApi) => void;
  onChange?: (json: string) => void;
};

export type TextOptions = {
  text?: string;
  fontSize?: number;
  fill?: string;
  fontFamily?: string;
  textAlign?: "left" | "center" | "right";
};

export type DesignCanvasApi = {
  addText: (opts?: TextOptions) => void;
  updateActiveText: (opts: TextOptions) => void;
  addImageFile: (file: File) => Promise<void>;
  addImageUrl: (url: string) => Promise<void>;
  bringForward: () => void;
  sendBack: () => void;
  deleteSelected: () => void;
  loadJson: (json: string) => Promise<void>;
  toJSON: () => string;
  toDataURL: () => string;
  exportDesignOverlay: () => string | null;
  getCanvas: () => Canvas | null;
};

const PRINT_AREA = {
  left: 0.3,
  top: 0.28,
  width: 0.4,
  height: 0.38,
};

export function DesignCanvas({
  garmentUrl,
  width = 360,
  height = 460,
  initialPhrase,
  onReady,
  onChange,
}: Props) {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<Canvas | null>(null);
  const initialPhraseRef = useRef(initialPhrase);
  initialPhraseRef.current = initialPhrase;
  const printAreaRef = useRef({
    left: width * PRINT_AREA.left,
    top: height * PRINT_AREA.top,
    width: width * PRINT_AREA.width,
    height: height * PRINT_AREA.height,
  });

  useEffect(() => {
    if (!canvasEl.current) return;

    printAreaRef.current = {
      left: width * PRINT_AREA.left,
      top: height * PRINT_AREA.top,
      width: width * PRINT_AREA.width,
      height: height * PRINT_AREA.height,
    };

    const canvas = new Canvas(canvasEl.current, {
      width,
      height,
      backgroundColor: "#f3efe6",
      preserveObjectStacking: true,
      selection: true,
      allowTouchScrolling: false,
    });
    canvasRef.current = canvas;

    const emit = () => onChange?.(JSON.stringify(canvas.toJSON()));
    canvas.on("object:modified", emit);
    canvas.on("object:added", emit);
    canvas.on("object:removed", emit);

    const placeImage = async (src: string) => {
      const img = await FabricImage.fromURL(src, { crossOrigin: "anonymous" });
      const maxW = printAreaRef.current.width * 0.85;
      const scale = Math.min(1, maxW / (img.width || maxW));
      img.set({
        left: printAreaRef.current.left + 12,
        top: printAreaRef.current.top + 24,
        scaleX: scale,
        scaleY: scale,
      });
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.requestRenderAll();
    };

    const api: DesignCanvasApi = {
      addText: (opts = {}) => {
        const text = new FabricText(opts.text ?? "GoodLuck", {
          left: printAreaRef.current.left + 16,
          top: printAreaRef.current.top + 36,
          fontFamily: opts.fontFamily ?? "Syne, Source Sans 3, Arial, sans-serif",
          fontSize: opts.fontSize ?? 28,
          fill: opts.fill ?? "#1c1a17",
          textAlign: opts.textAlign ?? "center",
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.requestRenderAll();
      },
      updateActiveText: (opts) => {
        const obj = canvas.getActiveObject();
        if (
          !obj ||
          (obj.type !== "text" &&
            obj.type !== "i-text" &&
            obj.type !== "textbox")
        ) {
          return;
        }
        const text = obj as FabricText;
        if (opts.text != null) text.set("text", opts.text);
        if (opts.fontSize != null) text.set("fontSize", opts.fontSize);
        if (opts.fill != null) text.set("fill", opts.fill);
        if (opts.fontFamily != null) text.set("fontFamily", opts.fontFamily);
        if (opts.textAlign != null) text.set("textAlign", opts.textAlign);
        canvas.requestRenderAll();
        emit();
      },
      addImageFile: async (file) => {
        const dataUrl = await fileToDataUrl(file);
        await placeImage(dataUrl);
      },
      addImageUrl: async (url) => {
        await placeImage(url);
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
          if ((obj as FabricObject & { isPrintGuide?: boolean }).isPrintGuide) return;
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
      exportDesignOverlay: () => {
        const objects = canvas
          .getObjects()
          .filter(
            (o) =>
              !(o as FabricObject & { isGarment?: boolean }).isGarment &&
              !(o as FabricObject & { isPrintGuide?: boolean }).isPrintGuide,
          );
        if (!objects.length) return null;
        return canvas.toDataURL({
          format: "png",
          multiplier: 2,
          left: printAreaRef.current.left,
          top: printAreaRef.current.top,
          width: printAreaRef.current.width,
          height: printAreaRef.current.height,
        });
      },
      getCanvas: () => canvasRef.current,
    };

    const phrase = initialPhraseRef.current?.trim();
    if (phrase) {
      api.addText({
        text: phrase,
        fontSize: 22,
        textAlign: "center",
      });
    }

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

      const scale = Math.min(
        width / (img.width || width),
        height / (img.height || height),
      );
      img.set({
        left: (width - (img.width || 0) * scale) / 2,
        top: (height - (img.height || 0) * scale) / 2,
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
    <div className="relative mx-auto w-full max-w-[360px] overflow-hidden border border-border bg-[#f3efe6] shadow-sm touch-none">
      <div
        className="pointer-events-none absolute z-10 border border-dashed border-accent/50"
        style={{
          left: `${PRINT_AREA.left * 100}%`,
          top: `${PRINT_AREA.top * 100}%`,
          width: `${PRINT_AREA.width * 100}%`,
          height: `${PRINT_AREA.height * 100}%`,
        }}
      />
      <canvas ref={canvasEl} className="mx-auto block max-w-full" />
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
