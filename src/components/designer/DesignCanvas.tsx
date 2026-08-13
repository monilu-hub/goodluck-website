"use client";

import { useEffect, useRef } from "react";
import {
  Canvas,
  FabricImage,
  FabricObject,
  FabricText,
} from "fabric";

type Props = {
  garmentUrl?: string | null;
  width?: number;
  height?: number;
  initialPhrase?: string;
  /** overlay = transparent canvas over the model torso (Canva-style) */
  variant?: "flat" | "overlay";
  showGuide?: boolean;
  onReady?: (api: DesignCanvasApi) => void;
  onChange?: (json: string) => void;
  onSelectionChange?: (hasSelection: boolean, isText: boolean) => void;
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
  addQrImage: (src: string) => Promise<void>;
  bringForward: () => void;
  sendBack: () => void;
  deleteSelected: () => void;
  duplicateSelected: () => Promise<void>;
  flipHorizontal: () => void;
  rotateBy: (degrees: number) => void;
  loadJson: (json: string) => Promise<void>;
  toJSON: () => string;
  toDataURL: () => string;
  exportDesignOverlay: () => string | null;
  getCanvas: () => Canvas | null;
};

/** Normalized print area for flat mockup mode. */
const FLAT_PRINT_AREA = {
  left: 0.28,
  top: 0.26,
  width: 0.44,
  height: 0.4,
};

function isProtected(obj: FabricObject) {
  const meta = obj as FabricObject & {
    isGarment?: boolean;
    isPrintGuide?: boolean;
  };
  return Boolean(meta.isGarment || meta.isPrintGuide);
}

function isTextObject(obj: FabricObject | null | undefined) {
  if (!obj) return false;
  return obj.type === "text" || obj.type === "i-text" || obj.type === "textbox";
}

async function fitGarmentToCanvas(
  canvas: Canvas,
  garmentUrl: string,
  width: number,
  height: number,
) {
  const existing = canvas
    .getObjects()
    .find((o) => (o as FabricObject & { isGarment?: boolean }).isGarment);
  if (existing) canvas.remove(existing);

  const img = await FabricImage.fromURL(garmentUrl, {
    crossOrigin: "anonymous",
  });
  const naturalW = img.width || width;
  const naturalH = img.height || height;
  const scale = Math.min(width / naturalW, height / naturalH) * 0.92;

  img.set({
    originX: "center",
    originY: "center",
    left: width / 2,
    top: height / 2,
    scaleX: scale,
    scaleY: scale,
    selectable: false,
    evented: false,
    hoverCursor: "default",
  });
  (img as FabricObject & { isGarment?: boolean }).isGarment = true;
  canvas.insertAt(0, img);
  canvas.requestRenderAll();
}

export function DesignCanvas({
  garmentUrl,
  width = 360,
  height = 460,
  initialPhrase,
  variant = "flat",
  showGuide = true,
  onReady,
  onChange,
  onSelectionChange,
}: Props) {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<Canvas | null>(null);
  const initialPhraseRef = useRef(initialPhrase);
  const onSelectionChangeRef = useRef(onSelectionChange);
  const isOverlay = variant === "overlay";
  const printAreaRef = useRef(
    isOverlay
      ? { left: 0, top: 0, width, height }
      : {
          left: width * FLAT_PRINT_AREA.left,
          top: height * FLAT_PRINT_AREA.top,
          width: width * FLAT_PRINT_AREA.width,
          height: height * FLAT_PRINT_AREA.height,
        },
  );

  useEffect(() => {
    initialPhraseRef.current = initialPhrase;
  }, [initialPhrase]);

  useEffect(() => {
    onSelectionChangeRef.current = onSelectionChange;
  }, [onSelectionChange]);

  useEffect(() => {
    if (!canvasEl.current) return;

    printAreaRef.current = isOverlay
      ? { left: 0, top: 0, width, height }
      : {
          left: width * FLAT_PRINT_AREA.left,
          top: height * FLAT_PRINT_AREA.top,
          width: width * FLAT_PRINT_AREA.width,
          height: height * FLAT_PRINT_AREA.height,
        };

    const canvas = new Canvas(canvasEl.current, {
      width,
      height,
      backgroundColor: isOverlay ? "transparent" : "#efe9df",
      preserveObjectStacking: true,
      selection: true,
      allowTouchScrolling: false,
      controlsAboveOverlay: true,
    });
    canvasRef.current = canvas;

    FabricObject.prototype.set({
      cornerSize: 16,
      touchCornerSize: 26,
      borderColor: "#3d5a45",
      cornerColor: "#fffdf9",
      cornerStrokeColor: "#3d5a45",
      transparentCorners: false,
      borderScaleFactor: 2,
      padding: 4,
    });

    const emit = () => onChange?.(JSON.stringify(canvas.toJSON()));
    const emitSelection = () => {
      const active = canvas.getActiveObject();
      const selectable =
        Boolean(active) && !isProtected(active as FabricObject);
      onSelectionChangeRef.current?.(selectable, isTextObject(active));
    };

    canvas.on("object:modified", emit);
    canvas.on("object:added", emit);
    canvas.on("object:removed", emit);
    canvas.on("selection:created", emitSelection);
    canvas.on("selection:updated", emitSelection);
    canvas.on("selection:cleared", emitSelection);

    const centerInPrintArea = (obj: FabricObject) => {
      const area = printAreaRef.current;
      obj.set({
        originX: "center",
        originY: "center",
        left: area.left + area.width / 2,
        top: area.top + area.height / 2,
      });
      obj.setCoords();
    };

    const placeImage = async (src: string, sizeFactor = 0.8) => {
      const img = await FabricImage.fromURL(src, { crossOrigin: "anonymous" });
      const maxW = printAreaRef.current.width * sizeFactor;
      const maxH = printAreaRef.current.height * sizeFactor;
      const nw = img.width || maxW;
      const nh = img.height || maxH;
      const scale = Math.min(maxW / nw, maxH / nh, 1);
      img.set({ scaleX: scale, scaleY: scale });
      centerInPrintArea(img);
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.requestRenderAll();
      emitSelection();
    };

    const api: DesignCanvasApi = {
      addText: (opts = {}) => {
        const text = new FabricText(opts.text ?? "GoodLuck", {
          fontFamily:
            opts.fontFamily ?? "Syne, Source Sans 3, Arial, sans-serif",
          fontSize: opts.fontSize ?? (isOverlay ? 22 : 32),
          fill: opts.fill ?? "#1c1a17",
          textAlign: opts.textAlign ?? "center",
          originX: "center",
          originY: "center",
        });
        centerInPrintArea(text);
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.requestRenderAll();
        emitSelection();
      },
      updateActiveText: (opts) => {
        const obj = canvas.getActiveObject();
        if (!isTextObject(obj)) return;
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
        await placeImage(await fileToDataUrl(file));
      },
      addImageUrl: async (url) => {
        await placeImage(url);
      },
      addQrImage: async (src) => {
        await placeImage(src, 0.42);
      },
      bringForward: () => {
        const obj = canvas.getActiveObject();
        if (obj && !isProtected(obj)) {
          canvas.bringObjectForward(obj);
          canvas.requestRenderAll();
          emit();
        }
      },
      sendBack: () => {
        const obj = canvas.getActiveObject();
        if (obj && !isProtected(obj)) {
          canvas.sendObjectBackwards(obj);
          canvas.requestRenderAll();
          emit();
        }
      },
      deleteSelected: () => {
        canvas.getActiveObjects().forEach((obj) => {
          if (!isProtected(obj)) canvas.remove(obj);
        });
        canvas.discardActiveObject();
        canvas.requestRenderAll();
        emitSelection();
      },
      duplicateSelected: async () => {
        const obj = canvas.getActiveObject();
        if (!obj || isProtected(obj)) return;
        const cloned = await obj.clone();
        cloned.set({
          left: (obj.left ?? 0) + 14,
          top: (obj.top ?? 0) + 14,
        });
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        canvas.requestRenderAll();
        emitSelection();
      },
      flipHorizontal: () => {
        const obj = canvas.getActiveObject();
        if (!obj || isProtected(obj)) return;
        obj.set("flipX", !obj.flipX);
        canvas.requestRenderAll();
        emit();
      },
      rotateBy: (degrees) => {
        const obj = canvas.getActiveObject();
        if (!obj || isProtected(obj)) return;
        obj.rotate(((obj.angle ?? 0) + degrees) % 360);
        canvas.requestRenderAll();
        emit();
      },
      loadJson: async (json) => {
        await canvas.loadFromJSON(json);
        canvas.requestRenderAll();
        emitSelection();
      },
      toJSON: () => JSON.stringify(canvas.toJSON()),
      toDataURL: () => canvas.toDataURL({ format: "png", multiplier: 1.5 }),
      exportDesignOverlay: () => {
        const objects = canvas.getObjects().filter((o) => !isProtected(o));
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
      api.addText({ text: phrase, fontSize: isOverlay ? 20 : 24, textAlign: "center" });
    }

    onReady?.(api);

    return () => {
      canvas.dispose();
      canvasRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, variant]);

  useEffect(() => {
    if (isOverlay || !garmentUrl) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;

    (async () => {
      try {
        await fitGarmentToCanvas(canvas, garmentUrl, width, height);
      } catch {
        // Ignore load races when switching views quickly.
      }
      if (cancelled) return;
    })();

    return () => {
      cancelled = true;
    };
  }, [garmentUrl, width, height, isOverlay]);

  return (
    <div
      className={
        isOverlay
          ? "relative h-full w-full touch-none"
          : "relative mx-auto w-full overflow-hidden rounded-2xl border border-border bg-[#efe9df] shadow-sm touch-none"
      }
      style={isOverlay ? { width, height } : { maxWidth: width }}
    >
      {showGuide && !isOverlay && (
        <div
          aria-hidden
          className="pointer-events-none absolute z-10 rounded-sm border border-dashed border-accent/45"
          style={{
            left: `${FLAT_PRINT_AREA.left * 100}%`,
            top: `${FLAT_PRINT_AREA.top * 100}%`,
            width: `${FLAT_PRINT_AREA.width * 100}%`,
            height: `${FLAT_PRINT_AREA.height * 100}%`,
          }}
        />
      )}
      {showGuide && isOverlay && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 rounded-sm border border-dashed border-white/35"
        />
      )}
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
