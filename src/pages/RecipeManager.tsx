import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { IconNotebook, IconCrown } from '@tabler/icons-react';
import { Button } from '../components/atoms/Button';

export function RecipeManager() {
    const location = useLocation();
    const navigate = useNavigate();

    const isRecipes =
        location.pathname.startsWith('/admin/recipes') || location.pathname === '/admin';
    const isInspirations =
        location.pathname.startsWith('/admin/inspirations') ||
        location.pathname.startsWith('/admin/inpspirations');

    return (
        <div className="space-y-6 w-full">
            {/* Top Admin Navbar */}
            <nav
                className="flex items-center gap-2 border-b border-border pb-3 pt-1"
                aria-label="Admin Navigation"
            >
                <Button
                    text="Recipes"
                    icon={IconNotebook}
                    active={isRecipes}
                    onClick={() => navigate('/admin/recipes')}
                    variant="subtle"
                    activeClassName="font-semibold"
                    aria-current={isRecipes ? 'page' : undefined}
                />
                <Button
                    text="Inspirations"
                    icon={IconCrown}
                    active={isInspirations}
                    onClick={() => navigate('/admin/inspirations')}
                    variant="subtle"
                    activeClassName="font-semibold"
                    aria-current={isInspirations ? 'page' : undefined}
                />
            </nav>

            {/* Admin Sub-view */}
            <div className="w-full">
                <Outlet />
            </div>
        </div>
    );
}

export default RecipeManager;
