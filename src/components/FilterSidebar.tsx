import type { ChangeEvent } from 'react'
import { useMemo } from 'react'
import { useShopStore, formatInr } from '../store/useShopStore'
import type { SizeOption } from '../store/useShopStore'
import { CheckIcon, ChevronDownIcon, SearchIcon } from './icons'

const sizeOptions: SizeOption[] = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']

const colorOptions = [
  { label: 'Deep Black', hex: '#040404' },
  { label: 'Sky Blue', hex: '#8dd3ff' },
  { label: 'Sunset Orange', hex: '#ffa467' },
  { label: 'Coral Pink', hex: '#ff6f91' },
  { label: 'Mint', hex: '#98f5d0' },
  { label: 'Lavender', hex: '#c4b5fd' },
  { label: 'Canary', hex: '#fef08a' },
  { label: 'Slate Gray', hex: '#94a3b8' },
]

interface FilterSidebarProps {
  className?: string
}

const brandDetails = [
  {
    name: 'Nike',
    count: 123,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
  },
  {
    name: 'Adidas',
    count: 55,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg',
  },
  {
    name: 'Apple',
    count: 65,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
  },
  {
    name: 'New Balance',
    count: 99,
    logo: '', // Empty string for placeholder
  },
  {
    name: 'Puma',
    count: 325,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Puma_logo.svg',
  },
  {
    name: 'Uniqlo',
    count: 61,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/92/UNIQLO_logo.svg',
  },
]

export function FilterSidebar({ className }: FilterSidebarProps = {}) {
  const filters = useShopStore((state) => state.filters)
  const minCatalogPrice = useShopStore((state) => state.minCatalogPrice)
  const maxCatalogPrice = useShopStore((state) => state.maxCatalogPrice)
  const toggleBrand = useShopStore((state) => state.toggleBrand)
  const toggleSize = useShopStore((state) => state.toggleSize)
  const toggleColor = useShopStore((state) => state.toggleColor)
  const setPriceRange = useShopStore((state) => state.setPriceRange)
  const resetFilters = useShopStore((state) => state.resetFilters)
  const brandQuery = useShopStore((state) => state.brandFilterQuery)
  const setBrandQuery = useShopStore((state) => state.setBrandFilterQuery)
  const expandedSections = useShopStore((state) => state.expandedSections)
  const toggleSection = useShopStore((state) => state.toggleSection)

  const filteredBrands = useMemo(() => {
    if (!brandQuery.trim()) {
      return brandDetails
    }
    const lowered = brandQuery.trim().toLowerCase()
    return brandDetails.filter((brand) => brand.name.toLowerCase().includes(lowered))
  }, [brandQuery])

  const handleMinPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, type } = event.target
    const parsed =
      type === 'range'
        ? Number(value)
        : (() => {
            const numericString = value.replace(/[^0-9.]/g, '')
            if (numericString === '') {
              return minCatalogPrice
            }
            const numeric = Number(numericString)
            if (Number.isNaN(numeric)) {
              return null
            }
            return Math.round(numeric * 100)
          })()

    if (parsed === null || Number.isNaN(parsed)) {
      return
    }

    const clamped = Math.min(
      Math.max(parsed, minCatalogPrice),
      Math.max(minCatalogPrice, filters.maxPrice - 50),
    )

    setPriceRange(clamped, filters.maxPrice)
  }

  const handleMaxPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, type } = event.target
    const parsed =
      type === 'range'
        ? Number(value)
        : (() => {
            const numericString = value.replace(/[^0-9.]/g, '')
            if (numericString === '') {
              return maxCatalogPrice
            }
            const numeric = Number(numericString)
            if (Number.isNaN(numeric)) {
              return null
            }
            return Math.round(numeric * 100)
          })()

    if (parsed === null || Number.isNaN(parsed)) {
      return
    }

    const clamped = Math.max(
      Math.min(parsed, maxCatalogPrice),
      Math.min(maxCatalogPrice, filters.minPrice + 50),
    )

    setPriceRange(filters.minPrice, clamped)
  }

  return (
    <aside
      className={`w-full shrink-0 space-y-6 lg:w-[320px] xl:w-[360px] ${className ?? ''}`.trim()}
    >
      <div className="space-y-6 rounded-[15px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between" >
          <p className="text-sm font-semibold text-slate-600">Filter</p>
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs font-semibold text-sky-500 hover:text-sky-600"
          >
            Reset
          </button>
        </div>

        <div className="space-y-6">
          <section>
            <button
              type="button"
              onClick={() => toggleSection('brand')}
              className="mb-3 flex w-full items-center justify-between rounded-2xl border border-transparent px-2 py-1 text-left transition hover:border-slate-100"
            >
              <h3 className="text-sm font-semibold text-slate-600">Brand</h3>
              <ChevronDownIcon
                className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
                  expandedSections.brand ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedSections.brand ? (
              <>
                <div className="relative mb-4">
                  <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                  <input
                    type="search"
                    value={brandQuery}
                    onChange={(event) => setBrandQuery(event.target.value)}
                    placeholder="Search brand"
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-9 text-sm font-medium text-slate-600 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  />
                </div>
                <div className="space-y-2 rounded-[12px] border border-slate-100 p-2">
                  {filteredBrands.map(({ name, count, logo }) => {
                    const isActive = filters.brands.includes(name)
                    return (
                      <label
                        key={name}
                        className={`flex cursor-pointer items-center justify-between rounded-2xl px-3 py-2 transition ${
                          isActive ? 'bg-sky-50' : 'hover:bg-slate-50'
                        }`}
                        onClick={() => toggleBrand(name)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200">
                            {logo ? (
                              <img src={logo} alt={`${name} logo`} className="h-5 w-5 object-contain" />
                            ) : (
                              <span className="text-xs font-semibold text-slate-400">NB</span>
                            )}
                          </span>
                          <span className="text-sm font-medium text-slate-600">{name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-slate-400">{count}</span>
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                              isActive ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-200 text-transparent'
                            }`}
                          >
                            <CheckIcon className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </>
            ) : null}
          </section>

          <section>
            <button
              type="button"
              onClick={() => toggleSection('price')}
              className="mb-3 flex w-full items-center justify-between rounded-2xl border border-transparent px-2 py-1 text-left transition hover:border-slate-100"
            >
              <h3 className="text-sm font-semibold text-slate-600">Price</h3>
              <ChevronDownIcon
                className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
                  expandedSections.price ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedSections.price ? (
              <div className="rounded-[12px] border border-slate-100 p-4">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <span>{formatInr(minCatalogPrice / 100)}</span>
                  <span>{formatInr(maxCatalogPrice / 100)}</span>
                </div>
                <div className="mb-4 flex items-center justify-between text-sm font-semibold text-slate-600">
                  <span>{formatInr(filters.minPrice / 100)}</span>
                  <span>{formatInr(filters.maxPrice / 100)}</span>
                </div>
                <div className="relative mb-6 h-12">
                  <div className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-sky-100" />
                  <div
                    className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-sky-400"
                    style={{
                      left: `${((filters.minPrice - minCatalogPrice) / (maxCatalogPrice - minCatalogPrice)) * 100}%`,
                      right: `${100 - ((filters.maxPrice - minCatalogPrice) / (maxCatalogPrice - minCatalogPrice)) * 100}%`,
                    }}
                  />
                  <input
                    type="range"
                    min={minCatalogPrice}
                    max={maxCatalogPrice}
                    step={50}
                    value={filters.minPrice}
                    onChange={handleMinPriceChange}
                    className="price-range-thumb absolute left-0 top-1/2 h-2 w-full -translate-y-1/2 appearance-none bg-transparent"
                  />
                  <input
                    type="range"
                    min={minCatalogPrice}
                    max={maxCatalogPrice}
                    step={50}
                    value={filters.maxPrice}
                    onChange={handleMaxPriceChange}
                    className="price-range-thumb absolute left-0 top-1/2 h-2 w-full -translate-y-1/2 appearance-none bg-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex flex-col text-xs font-semibold text-slate-400">
                    Min
                    <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">₹</span>
                      <input
                        type="number"
                        step={0.5}
                        min={minCatalogPrice / 100}
                        max={maxCatalogPrice / 100}
                        inputMode="decimal"
                        value={(filters.minPrice / 100).toFixed(2)}
                        onChange={handleMinPriceChange}
                        className="w-full bg-transparent text-sm font-semibold text-slate-600 outline-none"
                      />
                    </div>
                  </label>
                  <label className="flex flex-col text-xs font-semibold text-slate-400">
                    Max
                    <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">₹</span>
                      <input
                        type="number"
                        step={0.5}
                        min={minCatalogPrice / 100}
                        max={maxCatalogPrice / 100}
                        inputMode="decimal"
                        value={(filters.maxPrice / 100).toFixed(2)}
                        onChange={handleMaxPriceChange}
                        className="w-full bg-transparent text-sm font-semibold text-slate-600 outline-none"
                      />
                    </div>
                  </label>
                </div>
              </div>
            ) : null}
          </section>

          <section>
            <button
              type="button"
              onClick={() => toggleSection('size')}
              className="mb-3 flex w-full items-center justify-between rounded-2xl border border-transparent px-2 py-1 text-left transition hover:border-slate-100"
            >
              <h3 className="text-sm font-semibold text-slate-600">Size</h3>
              <ChevronDownIcon
                className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
                  expandedSections.size ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedSections.size ? (
              <div className="flex flex-wrap gap-2 rounded-[12px] border border-slate-100 p-3">
                {sizeOptions.map((option) => {
                  const isActive = filters.sizes.includes(option)
                  return (
                    <button
                      type="button"
                      key={option}
                      onClick={() => toggleSize(option as SizeOption)}
                      className={`min-w-[3rem] rounded-xl border px-4 py-2 text-xs font-semibold transition ${
                        isActive
                          ? 'border-sky-500 bg-sky-50 text-sky-600'
                          : 'border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
            ) : null}
          </section>

          <section>
            <button
              type="button"
              onClick={() => toggleSection('color')}
              className="mb-3 flex w-full items-center justify-between rounded-2xl border border-transparent px-2 py-1 text-left transition hover:border-slate-100"
            >
              <h3 className="text-sm font-semibold text-slate-600">Color</h3>
              <ChevronDownIcon
                className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
                  expandedSections.color ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedSections.color ? (
              <div className="flex flex-wrap gap-3 rounded-[12px] border border-slate-100 p-3">
                {colorOptions.map((option) => {
                  const isActive = filters.colors.includes(option.label)
                  return (
                    <button
                      type="button"
                      key={option.label}
                      onClick={() => toggleColor(option.label)}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                        isActive ? 'border-sky-400' : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <span
                        className="inline-block h-7 w-7 rounded-full border border-white"
                        style={{ backgroundColor: option.hex }}
                        aria-label={option.label}
                      />
                    </button>
                  )
                })}
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </aside>
  )
}