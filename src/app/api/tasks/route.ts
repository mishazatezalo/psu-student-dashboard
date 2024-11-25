import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const tasks = await prisma.task.findMany({
    orderBy: { order: 'asc' },
  })
  return NextResponse.json(tasks)
}

export async function POST(request: Request) {
  const { text } = await request.json()
  const maxOrderTask = await prisma.task.findFirst({
    orderBy: { order: 'desc' },
  })
  const newOrder = maxOrderTask ? maxOrderTask.order + 1 : 0
  const task = await prisma.task.create({
    data: { text, order: newOrder },
  })
  return NextResponse.json(task)
}

export async function PUT(request: Request) {
  const { id, text, completed, order } = await request.json()
  const task = await prisma.task.update({
    where: { id },
    data: { text, completed, order },
  })
  return NextResponse.json(task)
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  await prisma.task.delete({
    where: { id },
  })
  return NextResponse.json({ success: true })
}

