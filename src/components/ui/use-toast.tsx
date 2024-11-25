import { useState, useCallback } from "react"

export type ToastProps = {
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: 'default' | 'destructive'
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = useCallback((props: ToastProps) => {
    setToasts((prevToasts) => [...prevToasts, props])
  }, [])

  const dismissToast = useCallback((index: number) => {
    setToasts((prevToasts) => prevToasts.filter((_, i) => i !== index))
  }, [])

  return { toast, dismissToast, toasts }
}

