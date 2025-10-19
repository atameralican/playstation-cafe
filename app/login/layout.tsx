import ToastProvider from "@/components/ui/alertDep"

export default function LoginLayout({
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
