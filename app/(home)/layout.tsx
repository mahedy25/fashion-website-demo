import Footer from "@/components/ui/shared/footer"
import Header from "@/components/ui/shared/header"


export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col min-h-screen'>
       <Header/> 
       <main className='flex-1'>{children}</main>
       <Footer />
    </div>
  )
}