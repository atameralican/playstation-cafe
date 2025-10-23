"use client"
import {  Frown,  } from "lucide-react"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function EmptyGameList() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia className="size-24" variant="default">
          <Frown className="size-24"/>
        </EmptyMedia>
        <EmptyTitle>Kol Bozuk</EmptyTitle>
        <EmptyDescription>
          Maalesef aramaya çalıştığınız oyun bulunamamıştır.
        </EmptyDescription>
      </EmptyHeader>
    
      
    </Empty>
  )
}
