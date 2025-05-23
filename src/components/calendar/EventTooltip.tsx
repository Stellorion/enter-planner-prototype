import { useState } from 'react';
import {
  useFloating,
  useInteractions,
  useHover,
  offset,
  flip,
  shift,
  FloatingPortal,
} from '@floating-ui/react';
import { EventTooltipProps } from '@/src/types/event';

const EventTooltip = ({
  title,
  notes,
  start,
  end,
  allDay,
  children,
}: EventTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    if (allDay) {
      return date.toLocaleDateString('en-GB');
    }
    return date.toLocaleString('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const { refs, floatingStyles, context, placement } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(8), flip(), shift()],
    placement: 'top',
  });

  const hover = useHover(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>
      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="relative z-10 max-w-xs border rounded-md bg-white border-gray-200 px-3 py-2 text-sm text-white dark:text-gray-100 shadow-lg dark:bg-gray-900 dark:border-gray-800"
          >
            <div className="text-center font-semibold text-gray-900 dark:text-gray-100">{title}</div>
            <div className="mt-1 text-center text-gray-700 dark:text-gray-300">
              <div>
                {allDay ? 'Date: ' : 'Start: '}
                {formatDateTime(start)}
              </div>
              {end && (
                <div>
                  {allDay ? 'To: ' : 'End: '}
                  {formatDateTime(end)}
                </div>
              )}
            </div>
            {notes && (
              <div className="mt-2 border-t border-gray-700 dark:border-gray-300 pt-2 break-words text-gray-700 dark:text-gray-300">
                {notes}
              </div>
            )}

            <div
              className={`absolute h-2 w-2 rotate-45 border-b border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 ${placement === 'top' && 'bottom-[-4px]'} ${placement === 'bottom' && 'top-[-4px]'} ${placement === 'left' && 'right-[-4px]'} ${placement === 'right' && 'left-[-4px]'} ${placement.includes('top') && 'left-1/2 -translate-x-1/2'} ${placement.includes('bottom') && 'left-1/2 -translate-x-1/2'} ${placement.includes('left') && 'top-1/2 -translate-y-1/2'} ${placement.includes('right') && 'top-1/2 -translate-y-1/2'}`}
            />
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

export default EventTooltip;
