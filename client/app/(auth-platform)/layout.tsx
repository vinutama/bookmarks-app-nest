import Navbar from "./_components/navbar";


const AuthLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div className="h-full bg-slate-200">
            <Navbar/>
            <main className="pt-40 pb-20 bg-slate-200">
                {children}
            </main>
        </div>
    );
};

export default AuthLayout;