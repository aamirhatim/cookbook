import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IconUser } from '@tabler/icons-react';
import { IconButton } from '../atoms/IconButton';
import { useAuthModal } from '../../hooks/useAuthModal';

export function Navbar({ className = '' }: { className?: string } = {}) {
    const location = useLocation();
    const navigate = useNavigate();
    const { requireAuth } = useAuthModal();

    const isHome = location.pathname === '/';
    const isAccount = location.pathname === '/account';

    const handleAccountClick = () => {
        if (isAccount) return;

        requireAuth(
            () => {
                navigate('/account');
            },
            {
                title: 'Account',
                description: 'Sign in or create an account to view and manage your profile.',
            }
        );
    };

    return (
        <header
            aria-label="Page Header"
            className={`pt-2 flex justify-between items-center gap-4 lg:pt-0 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:flex-col lg:justify-between lg:items-center lg:w-16 xl:w-20 lg:shrink-0 lg:py-2 lg:px-2 ${className}`.trim()}
        >
            <div className="min-w-0 flex-1 lg:flex-none lg:w-full lg:flex lg:flex-col lg:items-center">
                <Link
                    to="/"
                    aria-label="The Cookbook - Home"
                    className="inline-block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg transition-transform active:scale-[0.98]"
                >
                    {isHome ? (
                        <h1 className="text-4xl sm:text-5xl bungee-tint-regular palette-bungee-culinary text-foreground lg:writing-vertical-upright lg:text-5xl xl:text-6xl lg:tracking-tight lg:uppercase select-none text-left lg:text-center group-hover:opacity-90 transition-opacity">
                            The Cookbook
                        </h1>
                    ) : (
                        <span className="text-4xl sm:text-5xl bungee-tint-regular palette-bungee-culinary text-foreground lg:writing-vertical-upright lg:text-5xl xl:text-6xl lg:tracking-tight lg:uppercase select-none text-left lg:text-center block group-hover:opacity-90 transition-opacity">
                            The Cookbook
                        </span>
                    )}
                </Link>
            </div>

            <div className="shrink-0 lg:mt-auto lg:w-full lg:flex lg:items-center lg:justify-center">
                <IconButton
                    icon={IconUser}
                    onClick={handleAccountClick}
                    title="Account"
                    ariaLabel="Account"
                    active={isAccount}
                />
            </div>
        </header>
    );
}

export default Navbar;
