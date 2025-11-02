import { useMemo, useState, useEffect } from 'react'
import { AppHeader } from './components/AppHeader'
import { CartDrawer } from './components/CartDrawer'
import { FilterSidebar } from './components/FilterSidebar'
import { ProductCard } from './components/ProductCard'
import { CloseIcon, FilterIcon } from './components/icons'
import { SortSelect } from './components/SortSelect'
import { ViewToggle } from './components/ViewToggle'
import { AuthModal } from './components/AuthModal'
import { useShopStore, computeFilteredProducts } from './store/useShopStore'

// Carousel images data
const carouselImages = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    title: 'Summer Collection',
    description: 'Discover the latest trends'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80',
    title: 'New Arrivals',
    description: 'Fresh styles just for you'
  },
  {
    id: 3,
    url: 'https://img.freepik.com/free-photo/shop-clothing-clothes-shop-hanger-modern-shop-boutique_1150-8886.jpg?semt=ais_hybrid&w=740&q=80',
    title: 'Premium Quality',
    description: 'Comfort meets style'
  },
  {
    id: 4,
    url: 'https://cdn.sanity.io/images/xz607zi6/production/e49030c47328e4dd4e51429f58df5b41a8430318-1200x640.png?w=1920&fm=webp&q=80',
    title: 'Exclusive Deals',
    description: 'Limited time offers'
  }
]

function ImageCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
    }, 4000) // Change slide every 4 seconds

    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
  }

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

  return (
    <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden rounded-2xl mx-1 mt-4">
      {/* Carousel Slides */}
      <div 
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {carouselImages.map((image) => (
          <div key={image.id} className="w-full flex-shrink-0 relative">
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
            />
            {/* Overlay with text */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">
                  {image.title}
                </h2>
                <p className="text-lg sm:text-xl md:text-2xl opacity-90">
                  {image.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-lg transition hover:bg-white hover:text-sky-600"
        aria-label="Previous slide"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-lg transition hover:bg-white hover:text-sky-600"
        aria-label="Next slide"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 w-3 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const products = useShopStore((state) => state.products)
  const filters = useShopStore((state) => state.filters)
  const isMobileFilterOpen = useShopStore((state) => state.isMobileFilterOpen)
  const setMobileFilterOpen = useShopStore((state) => state.setMobileFilterOpen)
  const viewMode = useShopStore((state) => state.viewMode)

  const filteredProducts = useMemo(
    () => computeFilteredProducts(products, filters),
    [products, filters],
  )

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AppHeader />
      <CartDrawer />
      <AuthModal />
      
      {/* Replace breadcrumb section with image carousel */}
      <ImageCarousel />

      <main className="mx-1 flex w-full max-w-full flex-col gap-4 px-3 py-4 sm:px-6 lg:flex-row lg:gap-6">
        <div className="hidden lg:block lg:w-[300px] xl:w-[340px]">
          <FilterSidebar />
        </div>

        <section className="flex-1 space-y-6">
          <header className="flex flex-col gap-3 rounded-[15px] border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:p-4">
            <div className="flex w-full items-center justify-center sm:w-auto sm:flex-1 sm:justify-start">
              <ViewToggle />
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="flex w-full items-center justify-center gap-3 rounded-[15px] border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-semibold text-sky-600 shadow-sm transition hover:border-sky-300 hover:text-sky-700 lg:hidden sm:w-auto sm:justify-start"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-white">
                  <FilterIcon className="h-3.5 w-3.5" />
                </span>
                Filter
              </button>
              <div className="w-full sm:w-auto">
                <SortSelect />
              </div>
            </div>
          </header>

          {filteredProducts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white/80 p-12 text-center text-sm font-medium text-slate-400">
              No items match your filters. Try adjusting brand, price, or color options.
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      {isMobileFilterOpen ? (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Filters</p>
                <p className="text-sm font-semibold text-slate-700">Refine your search</p>
              </div>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-slate-300"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <FilterSidebar className="h-full rounded-none border-0 bg-white p-6 shadow-none" />
          </div>
        </div>
      ) : null}
    </div>
  )
}