import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { useProductStore, useAdminAuthStore, type Product } from '../store/store'
import { useSound } from '../context/SoundContext'

type Toast = { id: number; text: string }

const getStockStatus = (p: Product): 'out' | 'low' | 'ok' => {
  if (p.stockQuantity <= 0) return 'out'
  if (p.stockQuantity <= (p.lowStockAlert || 5)) return 'low'
  return 'ok'
}

/** Watches product stock app-wide and plays a sound + shows a toast the moment
 * any active product crosses into low/out-of-stock — e.g. right after an order
 * or advance-order completion deducts the last few units. */
export default function LowStockAlert() {
  const isLoggedIn = useAdminAuthStore(state => state.isLoggedIn)
  const products = useProductStore(state => state.products)
  const { play } = useSound()
  const flaggedIds = useRef(new Set<string | number>())
  const wasLoggedIn = useRef(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    if (!isLoggedIn) { wasLoggedIn.current = false; return }

    // Fresh login — re-announce every currently low/out-of-stock item, not
    // just ones that have newly crossed the threshold since last check.
    const justLoggedIn = !wasLoggedIn.current
    wasLoggedIn.current = true
    if (justLoggedIn) flaggedIds.current.clear()

    const lowStock = products.filter(p => p.isActive && getStockStatus(p) !== 'ok')
    const stillLowIds = new Set(lowStock.map(p => p.id))

    // Let a product re-alert in the future once it's been restocked above the threshold.
    flaggedIds.current.forEach(id => { if (!stillLowIds.has(id)) flaggedIds.current.delete(id) })

    const newlyLow = lowStock.filter(p => !flaggedIds.current.has(p.id))
    if (newlyLow.length === 0) return

    newlyLow.forEach(p => flaggedIds.current.add(p.id))
    play('alert')

    const outOfStock = newlyLow.filter(p => getStockStatus(p) === 'out')
    const lowOnly = newlyLow.filter(p => getStockStatus(p) === 'low')
    const lines = [
      outOfStock.length > 0 && `Out of stock: ${outOfStock.map(p => p.name).join(', ')}`,
      lowOnly.length > 0 && `Low stock: ${lowOnly.map(p => p.name).join(', ')}`,
    ].filter(Boolean) as string[]

    // Defer the state update out of the effect body — it's reacting to the
    // products store (an external system), not deriving state from props.
    const id = Date.now()
    queueMicrotask(() => {
      setToasts(current => [...current, { id, text: lines.join(' · ') }])
      setTimeout(() => setToasts(current => current.filter(t => t.id !== id)), 9000)
    })
  }, [products, isLoggedIn, play])

  if (!isLoggedIn || toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[200] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2">
      {toasts.map(toast => (
        <div key={toast.id} className="animate-slideUp flex items-start gap-3 rounded-2xl border border-red-200 bg-white p-4 shadow-2xl">
          <div className="shrink-0 rounded-xl bg-red-50 p-2 text-red-600"><AlertTriangle size={18} /></div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-black text-[#111111]">Low Stock Alert</p>
            <p className="mt-1 text-[12px] leading-snug text-[#374151]">{toast.text}</p>
          </div>
          <button onClick={() => setToasts(current => current.filter(t => t.id !== toast.id))} className="shrink-0 text-[#9CA3AF] hover:text-[#374151]">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
