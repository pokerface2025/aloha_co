'use client'

import React from 'react'

type DigitalDeedProps = {
  ownerName?: string
  collectionName?: string
  serialNumber?: string
  issueDate?: string
}

export function DigitalDeed({
  ownerName = 'Nombre del titular',
  collectionName = 'Colección',
  serialNumber = '12/50',
  issueDate = 'Febrero 11, 2026',
}: DigitalDeedProps) {
  return (
    <div className="aspect-[1/1.414] w-full max-w-sm rounded-2xl border border-[#c9b37d]/60 bg-white/15 p-8 backdrop-blur-[40px]">
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-serif text-xl text-foreground">
              Título de Propiedad Digital
            </h3>
            <p className="mt-2 text-xs text-muted-foreground">
              Registro oficial de propiedad y autenticidad
            </p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-white/20 bg-white/25 text-[10px] text-foreground/70">
            QR
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 text-xs text-muted-foreground">
          <div>
            <p className="uppercase tracking-[0.2em] text-[10px] text-foreground/60">
              Titular
            </p>
            <p className="mt-2 text-sm font-medium text-foreground">{ownerName}</p>
          </div>
          <div>
            <p className="uppercase tracking-[0.2em] text-[10px] text-foreground/60">
              Colección
            </p>
            <p className="mt-2 text-sm font-medium text-foreground">{collectionName}</p>
          </div>
          <div>
            <p className="uppercase tracking-[0.2em] text-[10px] text-foreground/60">
              Serie
            </p>
            <p className="mt-2 font-serif text-2xl text-foreground">{serialNumber}</p>
          </div>
          <div>
            <p className="uppercase tracking-[0.2em] text-[10px] text-foreground/60">
              Fecha de emisión
            </p>
            <p className="mt-2 text-sm font-medium text-foreground">{issueDate}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
