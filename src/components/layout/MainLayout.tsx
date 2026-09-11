import { Outlet } from 'react-router-dom';
import { Navbar } from '../organisms/Navbar';

export function MainLayout() {
    return (
        <div className="w-full space-y-6 lg:space-y-0 lg:flex lg:gap-4 xl:gap-8 lg:items-start lg:justify-center">
            {/* Left: Sticky Navbar */}
            <Navbar />

            {/* Center: Main Outlet Content (stays centered) */}
            <div className="w-full lg:flex-1 lg:min-w-0">
                <Outlet />
            </div>

            {/* Right: Invisible phantom spacer balancing the navbar to center the outlet */}
            <div
                className="hidden lg:block lg:w-16 xl:w-20 lg:shrink-0 pointer-events-none"
                aria-hidden="true"
            />
        </div>
    );
}

export default MainLayout;
