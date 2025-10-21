import ToastProvider from "@/components/ui/alertDep"

export default function OyunlarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <ToastProvider />
    </>
  )
}
