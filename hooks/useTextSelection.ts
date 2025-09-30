"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface TextSelection {
  text: string;
  range: Range | null;
  position: { x: number; y: number };
  element: Element | null;
}

export interface UseTextSelectionOptions {
  onQuote?: (selection: TextSelection) => void;
  enabled?: boolean;
}

export function useTextSelection(options: UseTextSelectionOptions = {}) {
  const { onQuote, enabled = true } = options;
  const [selection, setSelection] = useState<TextSelection | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  // Helper function to find the closest element node
  const findElementNode = useCallback((node: Node): Element | null => {
    let currentNode: Node | null = node;
    while (currentNode && currentNode.nodeType !== Node.ELEMENT_NODE) {
      currentNode = currentNode.parentNode;
    }
    return currentNode as Element | null;
  }, []);

  const handleQuote = useCallback(() => {
    if (selection && onQuote) {
      onQuote(selection);
      // Clear selection after quoting
      window.getSelection()?.removeAllRanges();
      setSelection(null);
      setIsVisible(false);
    }
  }, [selection, onQuote]);

  const clearSelection = useCallback(() => {
    setSelection(null);
    setIsVisible(false);
  }, []);



  useEffect(() => {
    if (!enabled) return;

    // Simple and effective approach based on the working example
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (!text || text.length === 0 || !selection) {
        setSelection(null);
        setIsVisible(false);
        return;
      }

      // Check if selection is within our container and assistant message
      const range = selection.getRangeAt(0);
      const elementNode = findElementNode(range.commonAncestorContainer);
      
      if (!elementNode) {
        setSelection(null);
        setIsVisible(false);
        return;
      }

      const assistantMessage = elementNode.closest('[data-role="assistant"]');
      if (!assistantMessage || !containerRef.current?.contains(assistantMessage)) {
        setSelection(null);
        setIsVisible(false);
        return;
      }

      // Check if selection is within interactive elements
      const interactiveElement = elementNode.closest('button, a, input, textarea, select');
      if (interactiveElement) {
        setSelection(null);
        setIsVisible(false);
        return;
      }

      // Position popup above the selection with better positioning
      const rect = range.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      
      if (!containerRect) {
        setSelection(null);
        setIsVisible(false);
        return;
      }

      // Position popup to the right of selection to avoid overlap with native popup
      const position = {
        x: rect.right - containerRect.left + 10, // Position to the right
        y: rect.top - containerRect.top - 10, // Slightly above
      };

      setSelection({
        text,
        range: range.cloneRange(),
        position,
        element: assistantMessage,
      });
      setIsVisible(true);
    };

    // Prevent context menu only when text is selected
    const handleContextMenu = (e: MouseEvent) => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        const target = e.target as Node;
        const elementNode = findElementNode(target);
        
        if (elementNode) {
          const assistantMessage = elementNode.closest('[data-role="assistant"]');
          if (assistantMessage && containerRef.current?.contains(assistantMessage)) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
          }
        }
      }
    };

    // Additional prevention for selectstart event
    const handleSelectStart = (e: Event) => {
      const target = e.target as Node;
      const elementNode = findElementNode(target);
      
      if (elementNode) {
        const assistantMessage = elementNode.closest('[data-role="assistant"]');
        if (assistantMessage && containerRef.current?.contains(assistantMessage)) {
          // Don't prevent selection, but prepare to hide native popup
          setTimeout(() => {
            hideNativePopups();
          }, 10);
        }
      }
    };

    // Hide native browser popups aggressively - but exclude sidebar elements
    const hideNativePopups = () => {
      const nativePopups = document.querySelectorAll(
        '[data-testid="mini-menu"], .mini-menu, [class*="mini-menu"], [role="toolbar"], [class*="toolbar"], [class*="selection"], [class*="popup"], [class*="context"], [class*="action"]'
      );
      nativePopups.forEach(popup => {
        const element = popup as HTMLElement;
        // Exclude our custom popup AND sidebar elements
        if (!element.closest('[data-quote-popup]') && !element.closest('[data-sidebar]') && !element.hasAttribute('data-sidebar')) {
          element.style.display = 'none';
          element.style.visibility = 'hidden';
          element.style.opacity = '0';
          element.style.pointerEvents = 'none';
          element.style.zIndex = '-1';
        }
      });
    };

    // Restore sidebar elements that might have been accidentally hidden
    const restoreSidebarElements = () => {
      const sidebarElements = document.querySelectorAll('[data-sidebar]');
      sidebarElements.forEach(element => {
        const el = element as HTMLElement;
        el.style.display = '';
        el.style.visibility = '';
        el.style.opacity = '';
        el.style.pointerEvents = '';
        el.style.zIndex = '';
      });
    };

    // Observer to continuously hide native popups
    const popupObserver = new MutationObserver(() => {
      hideNativePopups();
      restoreSidebarElements(); // Also restore sidebar elements
    });

    popupObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'data-testid', 'role', 'style']
    });

    // Hide popup when clicking outside
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest('[data-quote-popup]')) {
        clearSelection();
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("mousedown", handleMouseDown);

    // Show our popup immediately and try to hide native popup
    const originalHandleSelectionChange = handleSelectionChange;
    const enhancedHandleSelectionChange = () => {
      originalHandleSelectionChange();
      // Try to hide native popups immediately
      hideNativePopups();
      // And again after a short delay
      setTimeout(() => {
        hideNativePopups();
      }, 10);
      setTimeout(() => {
        hideNativePopups();
      }, 100);
    };

    document.addEventListener("selectionchange", enhancedHandleSelectionChange);

    // Immediately restore any sidebar elements that might be hidden
    restoreSidebarElements();

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("selectionchange", enhancedHandleSelectionChange);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("mousedown", handleMouseDown);
      popupObserver.disconnect();
    };
  }, [enabled, clearSelection, findElementNode]);

  return {
    selection,
    isVisible,
    containerRef,
    handleQuote,
    clearSelection,
  };
}
