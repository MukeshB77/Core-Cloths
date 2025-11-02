import React from 'react'
import type { Product } from '../store/useShopStore'
import { useShopStore, formatInr, getProductPriceInr } from '../store/useShopStore'
import { HeartFilledIcon, HeartIcon } from './icons'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const isLiked = useShopStore((state) => state.likes.includes(product.id))
  const toggleLike = useShopStore((state) => state.toggleLike)
  const addToCart = useShopStore((state) => state.addToCart)

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative overflow-hidden bg-slate-100">
        <img src={product.image} alt={product.name} className="h-64 w-full object-cover sm:h-72" />
        {product.isNewArrival ? (
          <span className="absolute left-4 top-4 rounded-full bg-sky-100 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-sky-600">
            New Arrival
          </span>
        ) : null}
        <button
          type="button"
          onClick={() => toggleLike(product.id)}
          className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-rose-300 hover:text-rose-500 ${
            isLiked ? 'border-rose-200 text-rose-500' : ''
          }`}
          aria-label={isLiked ? 'Unlike item' : 'Like item'}
        >
          {isLiked ? <HeartFilledIcon className="h-5 w-5" /> : <HeartIcon className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-5 px-5 pb-5 pt-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{product.brand}</p>
          <h3 className="text-lg font-semibold text-slate-800">{product.name}</h3>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3">
          <div>
            <p className="text-base font-semibold text-sky-500">
              {formatInr(getProductPriceInr(product))}
            </p>
            <p className="mt-1 text-xs font-semibold text-rose-500">
              {product.itemsLeft} items left
            </p>
          </div>
          <button
            type="button"
            onClick={() => addToCart(product.id)}
            className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-700 sm:text-sm"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  )
}