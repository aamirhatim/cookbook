import { useNavigate } from 'react-router-dom';
import { IconNotebook, IconPlus, IconSearch, IconUser, IconBook } from '@tabler/icons-react';
import { ButtonIcon } from '../components/atoms/ButtonIcon';

export function Home() {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <header className="pt-2 flex justify-between items-start gap-4">
                <div className="min-w-0 flex-1">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        My Recipe Book
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Handcrafted dishes, cooking notes, and family favorites.
                    </p>
                </div>
                <ButtonIcon
                    icon={IconUser}
                    onClick={() => navigate('/account')}
                    title="Account"
                    ariaLabel="Account"
                    className="shrink-0"
                />
            </header>

            {/* Quick Search Bar (links to /recipes) */}
            <div className="relative">
                <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" stroke={1} />
                <input
                    type="text"
                    placeholder="Search recipes, tags, ingredients..."
                    onFocus={() => navigate('/recipes')}
                    className="w-full bg-surface border border-input text-foreground rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-colors shadow-sm cursor-pointer"
                />
            </div>

            {/* Empty State / Get Started */}
            <div className="bg-surface border border-dashed border-border rounded-2xl p-8 text-center space-y-3">
                <div className="w-12 h-12 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center mx-auto">
                    <IconNotebook className="w-6 h-6" stroke={1} />
                </div>
                <h3 className="font-semibold text-foreground">Explore your kitchen</h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                    Your digital kitchen is ready. Browse your saved recipes or add a new dish.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                    <button
                        type="button"
                        onClick={() => navigate('/recipes')}
                        className="inline-flex items-center space-x-1.5 px-4 py-2 bg-surface hover:bg-surface-hover text-foreground border border-border rounded-lg text-sm font-medium shadow-sm transition-colors active:scale-98"
                    >
                        <IconBook className="w-4 h-4 text-primary" stroke={1.5} />
                        <span>Browse Recipes</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/recipes/new')}
                        className="inline-flex items-center space-x-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium shadow-sm transition-colors active:scale-98"
                    >
                        <IconPlus className="w-4 h-4" stroke={1.5} />
                        <span>New Recipe</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
