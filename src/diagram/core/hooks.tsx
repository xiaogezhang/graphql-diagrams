import { useRef, useEffect, PropsWithChildren } from 'react';

// This hook provides a wrapper to any React component.
// Other than the React component as child, it accept a callback.
// The hook will listen to click event, and let the wrapped child
// know if this click is inside or outside of the child object, 
// the callback function will be called whenever such event happens.
// The most frequent usage is to watch click outside of the component,
// if it's outside then hide the component.
// @ts-ignore
function useClickOutside(ref, onClickOutside?: (_: boolean) => void) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside && onClickOutside(true);
      } else if (ref.current && ref.current.contains(event.target)) {
        onClickOutside && onClickOutside(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onClickOutside]);
}

export default function OutsideClickObserver(props: PropsWithChildren<{onClickOutside?: (_: boolean) => void}>) {
  const wrapperRef = useRef(null);
  useClickOutside(wrapperRef, props.onClickOutside);
  return <div ref={wrapperRef}>{props.children}</div>;
}
