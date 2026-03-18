export const COLLECTIONS = {
  COLOMBIA: 'colombia',
  PLENTY: 'plenty',
  DOLCE_VITA: 'dolce-vita',
  QUILLAMI: 'quillami',
} as const

export type CollectionId = typeof COLLECTIONS[keyof typeof COLLECTIONS]
