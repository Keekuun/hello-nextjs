interface InterceptLabLayoutProps {
  children: React.ReactNode
  modal: React.ReactNode
}

export default function InterceptLabLayout({ children, modal }: InterceptLabLayoutProps) {
  return (
    <div className="relative">
      {children}
      {modal}
    </div>
  )
}


