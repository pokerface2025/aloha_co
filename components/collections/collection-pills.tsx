"use client"

import { GlassButton } from "@/components/ui/glass-button"
import type { Collection } from "@/src/data/collections"

interface CollectionPillsProps {
  collections: Collection[]
  activeSlug: string
  onSelect: (slug: string) => void
}

export function CollectionPills({ collections, activeSlug, onSelect }: CollectionPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <GlassButton
        size="sm"
        aria-pressed={activeSlug === "all"}
        className={
          activeSlug === "all"
            ? "bg-primary/80 text-primary-foreground border-primary/40"
            : ""
        }
        onClick={() => onSelect("all")}
      >
        All
      </GlassButton>
      {collections.map((collection) => (
        <GlassButton
          key={collection.id}
          size="sm"
          aria-pressed={activeSlug === collection.slug}
          className={
            activeSlug === collection.slug
              ? "bg-primary/80 text-primary-foreground border-primary/40"
              : ""
          }
          onClick={() => onSelect(collection.slug)}
        >
          {collection.name}
        </GlassButton>
      ))}
    </div>
  )
}
