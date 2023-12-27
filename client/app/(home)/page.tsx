import { Button } from "@/components/ui/button";
import { BookmarkCheck } from "lucide-react";
import { Open_Sans } from "next/font/google";
import localFont from "next/font/local";
import Link from "next/link";

import { cn } from "@/lib/utils";


const headingFont = localFont({
    src: "../../public/fonts/font.woff2"
});

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

const HomePage = () => {
    return (
        <div className="flex items-center justify-center flex-col">
            <div className={cn(
                "flex items-center justify-center flex-col", 
                headingFont.className
            )}>
                <div className="mb-4 flex items-center border shadow-sm p-4 bg-indigo-100 text-indigo-700 rounded-full uppercase">
                    <BookmarkCheck className="h-6 w-6 mr-2"/>
                    Your bookmark management
                </div>
                <h1 className="text-3xl md:text-6xl text-center text-neutral-800 mb-6">
                    SnapSave unleash the potential of your favorites
                </h1>
                <div className="text-3xl md:text-3xl bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 p-3 rounded-md pb-6 w-fit">
                    Navigate smarter, not harder.
                </div>
            </div>
            <div className={cn(
                "text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto", 
                textFont.className
            )}>
                    Bookmark Organization, Search Functionality, Customization and Collaboration/Sharing
            </div>
            <Button className="mt-6" size="lg" asChild>
                <Link href="/register">
                    Get SnapSave for free
                </Link>
            </Button>
        </div>
    );
};

export default HomePage;