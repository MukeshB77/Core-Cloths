import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { z } from 'zod'

// Zod schemas for validation
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type User = {
  id: string
  name: string
  email: string
}

export type SortOption =
  | 'recent'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'

export type SizeOption = 'XXS' | 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'

export interface Product {
  id: string
  name: string
  brand: string
  price: number
  currency: string
  size: SizeOption
  color: string
  image: string
  itemsLeft: number
  addedAt: string
  isNewArrival: boolean
}

export interface Filters {
  searchText: string
  brands: string[]
  colors: string[]
  sizes: SizeOption[]
  minPrice: number
  maxPrice: number
  sortBy: SortOption
}

export interface CartItem {
  productId: string
  quantity: number
}

export interface CartLine {
  product: Product
  quantity: number
  subtotal: number
}

interface ShopState {
  products: Product[]
  filters: Filters
  likes: string[]
  cart: CartItem[]
  isCartOpen: boolean
  isMobileFilterOpen: boolean
  readonly minCatalogPrice: number
  readonly maxCatalogPrice: number
  brandFilterQuery: string
  expandedSections: Record<'brand' | 'price' | 'size' | 'color', boolean>
  viewMode: 'grid' | 'list'
  user: User | null
  isAuthModalOpen: boolean
  authMode: 'login' | 'signup'
  setSearchText: (value: string) => void
  toggleBrand: (brand: string) => void
  setPriceRange: (min: number, max: number) => void
  toggleColor: (color: string) => void
  toggleSize: (size: SizeOption) => void
  setSortBy: (sort: SortOption) => void
  resetFilters: () => void
  toggleLike: (productId: string) => void
  addToCart: (productId: string) => void
  incrementCartItem: (productId: string) => void
  decrementCartItem: (productId: string) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  setCartOpen: (open: boolean) => void
  setMobileFilterOpen: (open: boolean) => void
  setBrandFilterQuery: (value: string) => void
  toggleSection: (section: keyof ShopState['expandedSections']) => void
  setViewMode: (mode: 'grid' | 'list') => void
  login: (email: string, password: string) => boolean
  signup: (name: string, email: string, password: string) => boolean
  logout: () => void
  setAuthModalOpen: (open: boolean) => void
  setAuthMode: (mode: 'login' | 'signup') => void
}

const DISPLAY_MIN_PRICE = 100 // INR
const DISPLAY_MAX_PRICE = 10000 // INR

// Mock user data for demo
const mockUsers = [
  { id: '1', name: 'Demo User', email: 'demo@example.com', password: 'password123' }
]

// ... existing imports and code ...

const productData: Product[] = [
  // Existing products
  {
    id: 'uniqlo-soft-shirt',
    name: 'Shirt Soft Cotton',
    brand: 'Uniqlo',
    price: 89900, // 899 INR
    currency: 'INR',
    size: 'M',
    color: 'Pebble Gray',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80',
    itemsLeft: 12,
    addedAt: '2025-02-11T09:00:00Z',
    isNewArrival: true,
  },
  {
    id: 'uniqlo-zip-neck',
    name: 'Zip Up Neck Shirt',
    brand: 'Uniqlo',
    price: 99900, // 999 INR
    currency: 'INR',
    size: 'L',
    color: 'Mist Gray',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80',
    itemsLeft: 8,
    addedAt: '2025-02-13T10:00:00Z',
    isNewArrival: true,
  },
  {
    id: 'nike-dry-fit',
    name: 'Dry Fit Tee',
    brand: 'Nike',
    price: 129900, // 1299 INR
    currency: 'INR',
    size: 'S',
    color: 'Pearl White',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80',
    itemsLeft: 9,
    addedAt: '2025-01-29T07:30:00Z',
    isNewArrival: true,
  },
  {
    id: 'adidas-relaxed-tee',
    name: 'Relaxed Fit Tee',
    brand: 'Adidas',
    price: 79900, // 799 INR
    currency: 'INR',
    size: 'M',
    color: 'Sand Beige',
    image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=700&q=80',
    itemsLeft: 15,
    addedAt: '2025-02-01T11:15:00Z',
    isNewArrival: false,
  },
  {
    id: 'apple-air-tee',
    name: 'Air Tee',
    brand: 'Apple',
    price: 159900, // 1599 INR
    currency: 'INR',
    size: 'M',
    color: 'Frost White',
    image: 'https://images.unsplash.com/photo-1522444195799-478538b28823?auto=format&fit=crop&w=700&q=80',
    itemsLeft: 3,
    addedAt: '2025-02-18T15:45:00Z',
    isNewArrival: true,
  },
  {
    id: 'puma-active',
    name: 'Active Essentials Tee',
    brand: 'Puma',
    price: 69900, // 699 INR
    currency: 'INR',
    size: 'S',
    color: 'Ocean Blue',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8623Lg6KAvX9fX97Pa4VTqCRHOndp-gwHnA&s',
    itemsLeft: 18,
    addedAt: '2025-02-03T09:30:00Z',
    isNewArrival: false,
  },
  
  // NEW PRODUCTS - ADD MORE BELOW
  
  {
    id: 'nike-sport-jacket',
    name: 'Sport Running Jacket',
    brand: 'Nike',
    price: 249900, // 2499 INR
    currency: 'INR',
    size: 'L',
    color: 'Black',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80',
    itemsLeft: 7,
    addedAt: '2025-02-20T10:00:00Z',
    isNewArrival: true,
  },
  {
    id: 'adidas-ultra-boost',
    name: 'Ultra Boost Shoes',
    brand: 'Adidas',
    price: 179900, // 1799 INR
    currency: 'INR',
    size: 'M',
    color: 'Core Black',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80',
    itemsLeft: 5,
    addedAt: '2025-02-19T14:30:00Z',
    isNewArrival: true,
  },
  {
    id: 'uniqlo-denim-jeans',
    name: 'Slim Fit Denim Jeans',
    brand: 'Uniqlo',
    price: 149900, // 1499 INR
    currency: 'INR',
    size: 'L',
    color: 'Dark Blue',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=80',
    itemsLeft: 12,
    addedAt: '2025-02-15T11:20:00Z',
    isNewArrival: false,
  },
  {
    id: 'puma-running-shorts',
    name: 'Running Pants',
    brand: 'Puma',
    price: 29900, // 299 INR
    currency: 'INR',
    size: 'M',
    color: 'Charcoal Gray',
    image: 'https://scssports.in/cdn/shop/files/Untitleddesign_3.png?v=1735194391',
    itemsLeft: 25,
    addedAt: '2025-02-10T08:45:00Z',
    isNewArrival: false,
  },
  {
    id: 'new-balance-574',
    name: '574 Classic Shoes',
    brand: 'New Balance',
    price: 89900, // 899 INR
    currency: 'INR',
    size: 'M',
    color: 'Navy Blue',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=700&q=80',
    itemsLeft: 8,
    addedAt: '2025-02-22T16:00:00Z',
    isNewArrival: true,
  },
  {
    id: 'apple-watch-band',
    name: 'Sport Band for Watch',
    brand: 'Apple',
    price: 49900, // 499 INR
    currency: 'INR',
    size: 'M',
    color: 'Product Red',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxNdxHgtkThkLBwBh-niiHkZ2-1_tmHT9VoA&s',
    itemsLeft: 20,
    addedAt: '2025-02-14T13:15:00Z',
    isNewArrival: false,
  },
  {
    id: 'nike-basketball',
    name: 'Basketball Jersey',
    brand: 'Nike',
    price: 129900, // 1299 INR
    currency: 'INR',
    size: 'XL',
    color: 'Team Red',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=700&q=80',
    itemsLeft: 6,
    addedAt: '2025-02-21T09:30:00Z',
    isNewArrival: true,
  },
  {
    id: 'adidas-backpack',
    name: 'Sport Backpack',
    brand: 'Adidas',
    price: 199900, // 1999 INR
    currency: 'INR',
    size: 'M',
    color: 'Black/White',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80',
    itemsLeft: 14,
    addedAt: '2025-02-17T12:00:00Z',
    isNewArrival: false,
  }
]

// ... rest of the code remains same ...

const minCatalogPrice = Math.min(
  DISPLAY_MIN_PRICE,
  ...productData.map((product) => product.price),
)

const maxCatalogPrice = Math.max(
  DISPLAY_MAX_PRICE,
  ...productData.map((product) => product.price),
)

const toggleValue = <T extends string>(collection: T[], value: T) =>
  collection.includes(value)
    ? collection.filter((item) => item !== value)
    : [...collection, value]

const sortProducts = (items: Product[], sortBy: SortOption): Product[] => {
  const copy = [...items]

  switch (sortBy) {
    case 'recent':
      return copy.sort(
        (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
      )
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price)
    case 'name-asc':
      return copy.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-desc':
      return copy.sort((a, b) => b.name.localeCompare(a.name))
    default:
      return copy
  }
}

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      products: productData,
      filters: {
        searchText: '',
        brands: [],
        colors: [],
        sizes: [],
        minPrice: minCatalogPrice,
        maxPrice: maxCatalogPrice,
        sortBy: 'recent',
      },
      likes: [],
      cart: [],
      isCartOpen: false,
      isMobileFilterOpen: false,
      minCatalogPrice,
      maxCatalogPrice,
      brandFilterQuery: '',
      expandedSections: {
        brand: true,
        price: true,
        size: true,
        color: true,
      },
      viewMode: 'grid',
      user: null,
      isAuthModalOpen: false,
      authMode: 'login',
      setSearchText: (value) =>
        set((state) => ({
          filters: { ...state.filters, searchText: value },
        })),
      toggleBrand: (brand) =>
        set((state) => ({
          filters: { ...state.filters, brands: toggleValue(state.filters.brands, brand) },
        })),
      setPriceRange: (min, max) =>
        set((state) => ({
          filters: {
            ...state.filters,
            minPrice: Math.max(minCatalogPrice, Math.min(min, max)),
            maxPrice: Math.min(maxCatalogPrice, Math.max(min, max)),
          },
        })),
      toggleColor: (color) =>
        set((state) => ({
          filters: { ...state.filters, colors: toggleValue(state.filters.colors, color) },
        })),
      toggleSize: (size) =>
        set((state) => ({
          filters: { ...state.filters, sizes: toggleValue(state.filters.sizes, size) },
        })),
      setSortBy: (sortBy) =>
        set((state) => ({
          filters: { ...state.filters, sortBy },
        })),
      resetFilters: () =>
        set(() => ({
          filters: {
            searchText: '',
            brands: [],
            colors: [],
            sizes: [],
            minPrice: minCatalogPrice,
            maxPrice: maxCatalogPrice,
            sortBy: 'recent',
          },
          brandFilterQuery: '',
        })),
      toggleLike: (productId) =>
        set((state) => ({
          likes: toggleValue(state.likes, productId),
        })),
      addToCart: (productId) =>
        set((state) => {
          const existing = state.cart.find((line) => line.productId === productId)

          if (existing) {
            return {
              cart: state.cart.map((line) =>
                line.productId === productId
                  ? { ...line, quantity: line.quantity + 1 }
                  : line,
              ),
              isCartOpen: true,
            }
          }

          return {
            cart: [...state.cart, { productId, quantity: 1 }],
            isCartOpen: true,
          }
        }),
      incrementCartItem: (productId) =>
        set((state) => ({
          cart: state.cart.map((line) =>
            line.productId === productId
              ? { ...line, quantity: line.quantity + 1 }
              : line,
          ),
        })),
      decrementCartItem: (productId) =>
        set((state) => ({
          cart: state.cart
            .map((line) =>
              line.productId === productId
                ? { ...line, quantity: line.quantity - 1 }
                : line,
            )
            .filter((line) => line.quantity > 0),
        })),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((line) => line.productId !== productId),
        })),
      clearCart: () =>
        set(() => ({
          cart: [],
        })),
      setCartOpen: (open) => set({ isCartOpen: open }),
      setMobileFilterOpen: (open) => set({ isMobileFilterOpen: open }),
      setBrandFilterQuery: (value) => set({ brandFilterQuery: value }),
      toggleSection: (section) =>
        set((state) => ({
          expandedSections: {
            ...state.expandedSections,
            [section]: !state.expandedSections[section],
          },
        })),
      setViewMode: (mode) => set({ viewMode: mode }),
      login: (email: string, password: string) => {
        const user = mockUsers.find(u => u.email === email && u.password === password)
        if (user) {
          set({ user: { id: user.id, name: user.name, email: user.email }, isAuthModalOpen: false })
          return true
        }
        return false
      },
      signup: (name: string, email: string, password: string) => {
        // In a real app, this would call an API
        const newUser = { id: Date.now().toString(), name, email, password }
        mockUsers.push(newUser)
        set({ user: { id: newUser.id, name: newUser.name, email: newUser.email }, isAuthModalOpen: false })
        return true
      },
      logout: () => set({ user: null }),
      setAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
      setAuthMode: (mode) => set({ authMode: mode }),
    }),
    {
      name: 'shop-storage',
      partialize: (state) => ({ 
        user: state.user,
        cart: state.cart,
        likes: state.likes 
      }),
    }
  )
)

export const computeFilteredProducts = (products: Product[], filters: Filters): Product[] => {
  const filtered = products.filter((product) => {
    const matchesSearch = filters.searchText
      ? product.name.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        product.brand.toLowerCase().includes(filters.searchText.toLowerCase())
      : true

    const matchesBrand = filters.brands.length === 0 || filters.brands.includes(product.brand)
    const matchesColor = filters.colors.length === 0 || filters.colors.includes(product.color)
    const matchesSize = filters.sizes.length === 0 || filters.sizes.includes(product.size)
    const matchesPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice

    return matchesSearch && matchesBrand && matchesColor && matchesSize && matchesPrice
  })

  return sortProducts(filtered, filters.sortBy)
}

export const buildCartLines = (products: Product[], cart: CartItem[]): CartLine[] =>
  cart
    .map((line) => {
      const product = products.find((item) => item.id === line.productId)
      if (!product) {
        return undefined
      }

      return {
        product,
        quantity: line.quantity,
        subtotal: getProductPriceInr(product) * line.quantity,
      }
    })
    .filter((line): line is CartLine => Boolean(line))

export const computeCartSummary = (cartLines: CartLine[]) =>
  cartLines.reduce(
    (acc, line) => ({
      totalItems: acc.totalItems + line.quantity,
      totalPrice: acc.totalPrice + line.subtotal,
    }),
    { totalItems: 0, totalPrice: 0 },
  )

export const getProductPriceInr = (product: Product) => product.price / 100

export const formatInr = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(value)