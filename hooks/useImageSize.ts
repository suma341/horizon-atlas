import { useEffect, useState } from "react";

function useImageSize(imageUrl: string) {
    const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  
    useEffect(() => {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        setSize({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
    }, [imageUrl]);
  
    return size;
}

export default useImageSize;