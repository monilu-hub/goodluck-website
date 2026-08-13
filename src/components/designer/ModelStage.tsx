"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  torsoFor,
  type CuratedModel,
  type GarmentCut,
  type ModelCamera,
} from "../../../data/models";
import {
  DesignCanvas,
  type DesignCanvasApi,
} from "./DesignCanvas";

type Props = {
  /** Predefined library / lookbook photo (no second shirt overlay) */
  stageUrl: string;
  model: CuratedModel;
  camera: ModelCamera;
  garmentCut?: GarmentCut;
  size?: string;
  initialPhrase?: string;
  canvasKey: string;
  initialJson?: string | null;
  onReady?: (api: DesignCanvasApi) => void;
  onChange?: (json: string) => void;
  onSelectionChange?: (hasSelection: boolean, isText: boolean) => void;
};

export function ModelStage({
  stageUrl,
  model,
  camera,
  garmentCut = "tee",
  size = "M",
  initialPhrase,
  canvasKey,
  initialJson,
  onReady,
  onChange,
  onSelectionChange,
}: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageW, setStageW] = useState(360);
  const torso = useMemo(
    () => torsoFor(model, camera, garmentCut, size),
    [model, camera, garmentCut, size],
  );

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 360;
      setStageW(Math.round(w));
    });
    ro.observe(el);
    setStageW(Math.round(el.clientWidth));
    return () => ro.disconnect();
  }, []);

  const stageH = Math.round(stageW * (4 / 3));
  const printW = Math.max(120, Math.round(stageW * torso.w * 0.76));
  const printH = Math.max(100, Math.round(stageH * torso.h * 0.55));

  return (
    <div
      ref={stageRef}
      className="relative mx-auto aspect-[3/4] w-full max-w-lg overflow-hidden rounded-2xl bg-[#e8e2d8]"
    >
      <Image
        key={stageUrl}
        src={stageUrl}
        alt={model.name}
        fill
        className="object-cover object-top"
        sizes="(max-width: 768px) 100vw, 512px"
        priority
      />

      {/* Fabric placement surface on the shirt area only */}
      <div
        className="absolute z-20"
        style={{
          left: `${(torso.x + torso.w * 0.12) * 100}%`,
          top: `${(torso.y + torso.h * 0.16) * 100}%`,
          width: `${torso.w * 0.76 * 100}%`,
          height: `${torso.h * 0.55 * 100}%`,
        }}
      >
        <DesignCanvas
          key={canvasKey}
          variant="overlay"
          showGuide
          width={printW}
          height={printH}
          initialPhrase={initialPhrase}
          onReady={(api) => {
            onReady?.(api);
            if (initialJson) void api.loadJson(initialJson);
          }}
          onChange={onChange}
          onSelectionChange={onSelectionChange}
        />
      </div>
    </div>
  );
}
