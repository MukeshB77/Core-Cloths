import type { ChangeEvent } from 'react'
import { useMemo, useState, useRef, useEffect } from 'react'
import { useShopStore, buildCartLines, computeCartSummary } from '../store/useShopStore'
import { CartIcon, SearchIcon, UserIcon, ChevronDownIcon } from './icons'

export function AppHeader() {
  const searchText = useShopStore((state) => state.filters.searchText)
  const setSearchText = useShopStore((state) => state.setSearchText)
  const openCart = useShopStore((state) => state.setCartOpen)
  const products = useShopStore((state) => state.products)
  const cart = useShopStore((state) => state.cart)
  const user = useShopStore((state) => state.user)
  const setAuthModalOpen = useShopStore((state) => state.setAuthModalOpen)
  const setAuthMode = useShopStore((state) => state.setAuthMode)
  const logout = useShopStore((state) => state.logout)

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const cartLines = useMemo(() => buildCartLines(products, cart), [products, cart])
  const cartSummary = useMemo(() => computeCartSummary(cartLines), [cartLines])

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
  }

  const handleAuthClick = () => {
    if (user) {
      setIsUserMenuOpen(!isUserMenuOpen)
    } else {
      setAuthMode('login')
      setAuthModalOpen(true)
    }
  }

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
  }

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-1 flex w-full items-center justify-between gap-3 px-3 py-3 sm:gap-4 sm:px-6">
        <div className="flex flex-shrink-0 items-center gap-3 sm:gap-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-[15px] bg-sky-500 text-base font-semibold text-white">
            CC
          </span>
          <span className="hidden text-lg font-bold text-slate-800 sm:block">CoreCloth</span>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="flex w-full max-w-[220px] min-w-0 items-center gap-3 rounded-[15px] border border-slate-200 bg-white px-3 py-2 shadow-sm sm:max-w-md sm:px-4 sm:py-0">
            <SearchIcon className="h-4 w-4 text-slate-400" />
            <input
              type="search"
              value={searchText}
              onChange={handleSearchChange}
              placeholder="Search items"
              className="h-9 w-full bg-transparent text-sm font-medium text-slate-600 outline-none sm:h-10"
            />
          </div>

          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={handleAuthClick}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-600 shadow-sm transition hover:border-sky-300 hover:text-sky-500 sm:px-4"
              aria-label={user ? 'User menu' : 'Login'}
            >
              <UserIcon className="h-5 w-5" />
              {user && (
                <>
                  <span className="hidden text-sm font-medium sm:block">
                    Hi, {user.name.split(' ')[0]}
                  </span>
                  <ChevronDownIcon 
                    className={`h-4 w-4 text-slate-400 transition-transform ${
                      isUserMenuOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </>
              )}
            </button>

            {user && isUserMenuOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <div className="my-1 h-px bg-slate-100" />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => openCart(true)}
            className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-sky-300 hover:text-sky-500 sm:h-11 sm:w-11"
            aria-label="Open cart"
          >
            <CartIcon className="h-5 w-5" />
            {cartSummary.totalItems > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-sky-500 px-1 text-[0.65rem] font-semibold text-white">
                {cartSummary.totalItems}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  )
}