import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ isOpen, onClose, title, children, className }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={cn(
        "backdrop:bg-black/40 backdrop:backdrop-blur-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0 p-0 rounded-2xl bg-bg-surface/95 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.2)] open:animate-in open:fade-in-0 open:zoom-in-95",
        "w-full max-w-lg",
        className
      )}
    >
      <div className="flex flex-col w-full h-full max-h-[85vh]">
        <div className="flex items-center justify-between p-6 border-b border-border-color/50 sticky top-0 bg-transparent z-10">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-bg-base transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </dialog>
  );
}
