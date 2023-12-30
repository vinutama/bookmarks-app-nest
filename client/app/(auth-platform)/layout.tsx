import { cn } from "@/lib/utils";
import { Open_Sans } from "next/font/google";
import Navbar from "./_components/navbar";

const textFont = Open_Sans({
    subsets: ['latin'],
    weight: [
      "300",
      "400",
      "500",
      "600",
      "700",
      "800"
    ]
  })


const AuthLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div className="h-full bg-slate-200">
            <Navbar/>
            <main className={cn("pt-40 pb-20 bg-slate-200", textFont.className)}>
                {children}
            </main>
        </div>
    );
};

export default AuthLayout;