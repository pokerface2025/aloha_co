'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { StorefrontImage } from '@/lib/products.server'

type ProductGalleryProps = {
  images: StorefrontImage[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const currentImage = images[selectedIndex] ?? images[0]

  if (!currentImage) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center rounded-[28px] border border-dashed border-[#8CB9D8]/28 bg-[#F6F0E6] text-sm text-[#5E7A93]">
        Sin imágenes disponibles
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-[#8CB9D8]/18 bg-white">
        <Image
          src={currentImage.url}
          alt={currentImage.alt || productName}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-2xl border transition ${
                index === selectedIndex
                  ? 'border-[#335A77] ring-2 ring-[#8CB9D8]/28'
                  : 'border-[#8CB9D8]/18'
              }`}
              aria-label={`Ver imagen ${index + 1} de ${productName}`}
            >
              <Image
                src={image.url}
                alt={image.alt || `${productName} miniatura ${index + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
