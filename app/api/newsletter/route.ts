import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'

type SubscriberRecord = {
  code: string
  createdAt: string
  email: string
}

const DISCOUNT_CODE = 'ALOHA10'
const DATA_DIR = path.join(process.cwd(), 'data')
const FILE_PATH = path.join(DATA_DIR, 'subscribers.json')

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

async function readSubscribers() {
  try {
    const raw = await readFile(FILE_PATH, 'utf8')
    return JSON.parse(raw) as SubscriberRecord[]
  } catch {
    return []
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string }
    const email = body.email?.trim().toLowerCase() || ''

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Escribe un correo válido.' }, { status: 400 })
    }

    const subscribers = await readSubscribers()
    const exists = subscribers.some((subscriber) => subscriber.email === email)

    if (!exists) {
      const nextSubscriber: SubscriberRecord = {
        code: DISCOUNT_CODE,
        createdAt: new Date().toISOString(),
        email,
      }

      await mkdir(DATA_DIR, { recursive: true })
      await writeFile(FILE_PATH, JSON.stringify([nextSubscriber, ...subscribers], null, 2), 'utf8')
    }

    return NextResponse.json({
      code: DISCOUNT_CODE,
      message: 'Listo. Tu correo quedó registrado y te enviaremos tu beneficio de bienvenida.',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo registrar el correo.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
