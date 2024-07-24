import React from 'react';

export type Anchor = 'left' | 'right' | 'top' | 'bottom';

/**
 * Hook to use as resizing callback with mouse event. It saves starting position and set state to be
 * resizing when mouse down on the dragger, updating the position when mouse moving in resizing state,
 * and update the component size when mouse is up and in resizing state.
 * 
 * @param anchor if the component is anchored to the right, then the dragger is on the left, etc
 * @param initialSize initial size of the component that changes size
 * @param minSize minimal size. If not given, will use 0.
 * @returns 
 */
export function useResize(
  anchor: Anchor,
  initialSize: number,
  minSize?: number,
  maxSize?: number,
) {
  const [size, setSize] = React.useState<number>(initialSize);
  const [resizingStatus, setResizingStatus] = React.useState<{
    isResizing: boolean;
    startingCoord?: number;
  }>({isResizing: false});

  const enableResize = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const curCoord =
        anchor === 'left' || anchor === 'right' ? e.clientX : e.clientY;
      setResizingStatus({
        isResizing: true,
        startingCoord: curCoord,
      });
    },
    [anchor, setResizingStatus],
  );

  const disableResize = React.useCallback(
    (e: MouseEvent) => {
      setResizingStatus({
        isResizing: false,
      });
    },
    [setResizingStatus],
  );

  const resize = React.useCallback(
    (e: MouseEvent) => {
      if (resizingStatus.isResizing) {
        e.stopPropagation();
        const curCoord =
          anchor === 'left' || anchor === 'right' ? e.clientX : e.clientY;
        const delta = resizingStatus.startingCoord ? curCoord - resizingStatus.startingCoord : 0;
        const newSize = anchor === 'right' || anchor === 'bottom' ? size - delta : size + delta;
        if (newSize >= (minSize ?? 0)) {
          if (!maxSize || newSize <= maxSize) {
            setSize(newSize);
          }
        }
        setResizingStatus(prev => ({
          ...prev,
          startingCoord: curCoord,
        }))
      }
    },
    [anchor, size, minSize, maxSize, resizingStatus, setSize],
  );

  React.useEffect(() => {
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', disableResize);

    return () => {
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', disableResize);
    };
  }, [disableResize, resize]);

  return {size, enableResize};
}

// This hook provides a wrapper to any React component.
// Other than the React component as child, it accept a callback.
// The hook will listen to click event, and let the wrapped child
// know if this click is inside or outside of the child object,
// the callback function will be called whenever such event happens.
// The most frequent usage is to watch click outside of the component,
// if it's outside then hide the component.
export function useClickOutside(ref, onClickOutside?: (_: boolean) => void) {
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside && onClickOutside(true);
      } else if (ref.current && ref.current.contains(event.target)) {
        onClickOutside && onClickOutside(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, onClickOutside]);
}

/**
 * Wrapper component for React components, so it can observe the click events outside of the wrapped
 * component. It takes in a callback and a child component as prop.
 * 
 * @param props 
 * @returns 
 */
export default function OutsideClickObserver(
  props: React.PropsWithChildren<{onClickOutside?: (_: boolean) => void}>,
) {
  const wrapperRef = React.useRef(null);
  useClickOutside(wrapperRef, props.onClickOutside);
  return <div ref={wrapperRef}>{props.children}</div>;
}
