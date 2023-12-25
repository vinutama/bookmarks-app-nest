import { Button } from "@/components/ui/button";
import { BookmarkCheck } from "lucide-react";
import Link from "next/link";

const HomePage = () => {
    return (
        <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center flex-col">
                <div className="mb-4 flex items-center border shadow-sm p-4 bg-indigo-100 text-indigo-700 rounded-full uppercase">
                    <BookmarkCheck className="h-6 w-6 mr-2"/>
                    Your bookmark management
                </div>
                <h1 className="text-3xl md:text-6xl text-center text-neutral-800 mb-6">
                    SnapSave unleash the potential of your favorites
                </h1>
                <div className="text-3xl md:text-3xl bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 p-3 rounded-md pb-6 w-fit">
                    Effortless Organization, Instant Access!
                </div>
                <div className="text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto">
                    Bookmark Organization, Search Functionality, Customization and Collaboration/Sharing
                </div>
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