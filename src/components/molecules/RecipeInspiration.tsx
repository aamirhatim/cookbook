import React from 'react';
import { IconCrown } from '@tabler/icons-react';
import type { RecipeUrls } from '../../types/recipe';

export interface RecipeInspirationProps {
  urls?: RecipeUrls;
  className?: string;
}

/**
 * Ensures an external URL includes an http or https protocol so it resolves properly in new tabs.
 */
function formatExternalUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export const RecipeInspiration: React.FC<RecipeInspirationProps> = ({
  urls,
  className = '',
}) => {
  if (!urls) return null;

  const label = urls.label?.trim();
  const video = urls.video?.trim();
  const website = urls.website?.trim();

  // Don't render anything if all sub-fields are empty
  if (!label && !video && !website) {
    return null;
  }

  const hasLinks = Boolean(video || website);

  return (
    <div className={`flex items-center gap-1.5 text-sm sm:text-base text-muted-foreground ${className}`}>
      <IconCrown className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" stroke={1.5} />
      <span className="leading-normal">
        Inspired by {label && <span className="font-medium text-foreground">{label}</span>}
        {hasLinks && (
          <>
            {label ? ' (' : '('}
            {video && (
              <a
                href={formatExternalUrl(video)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline underline-offset-2 font-medium"
              >
                video
              </a>
            )}
            {video && website && ', '}
            {website && (
              <a
                href={formatExternalUrl(website)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline underline-offset-2 font-medium"
              >
                website
              </a>
            )}
            )
          </>
        )}
      </span>
    </div>
  );
};

export default RecipeInspiration;
