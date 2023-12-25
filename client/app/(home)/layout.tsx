const HomeLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div className="h-full bg-slate-200">
            {/** Navbar section here */}
            <main className="pt-40 pb-20 bg-slate-200">
                {children}
            </main>
            {/** Footer section here */}
        </div>
    );
};

export default HomeLayout;