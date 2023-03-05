import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
import type { UploadFile } from 'antd/es/upload/interface';
import { ControlValues } from '../types/controls';

export type AnaglyphTBContextType = {
  fileList: UploadFile[];
  setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  controlValues: ControlValues;
  setControlValues: React.Dispatch<React.SetStateAction<ControlValues>>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  downloadAnaglyph: () => void;
};

export const AnaglyphTBContext = React.createContext<AnaglyphTBContextType | null>(null);

const AnaglyphTBProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [controlValues, setControlValues] = useState<ControlValues>({
    deltaX: 0,
    deltaY: 0,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const downloadAnaglyph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL();
    const link = document.createElement('a');
    link.download = 'aynan-download.png';
    link.href = dataURL;
    link.click();
  }, [canvasRef.current]);

  const contextProps = useMemo(() => ({
    fileList, setFileList, controlValues, setControlValues, canvasRef, downloadAnaglyph,
  }), [fileList, setFileList, controlValues, setControlValues, canvasRef, downloadAnaglyph]);

  return (
    <AnaglyphTBContext.Provider value={contextProps}>
      {children}
    </AnaglyphTBContext.Provider>
  );
};

export default AnaglyphTBProvider;
