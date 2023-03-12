import { useRef, useState, useLayoutEffect } from 'react';

export type Dimensions = {
  width: number;
  height: number;
};

function useDimensions(): [React.RefObject<HTMLDivElement | undefined>, Dimensions] {
  const ref = useRef<HTMLDivElement>();
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const updateResize = () => {
      setDimensions(ref?.current?.getBoundingClientRect()?.toJSON());
    };

    updateResize();
    window.addEventListener('resize', updateResize);

    return () => {
      window.removeEventListener('resize', updateResize);
    };
  }, [ref.current]);

  return [ref, dimensions];
}

export default useDimensions;
