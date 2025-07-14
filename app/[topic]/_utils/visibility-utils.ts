import { IContentGroup } from '../_constants/content-types';
import { hasConfigDrivenContent } from './content-utils';
import { isPostPrivate } from './markdown-utils';

/**
 * Filters out private content items from a content group
 */
export function filterPrivateContent(
  group: IContentGroup,
  topic: string,
): IContentGroup {
  const filteredItems = group.items.filter((item) => {
    // Extract slug from href (e.g., '/posts/my-post' -> 'my-post')
    const slug = item.href.split('/').pop();
    if (!slug) return true;

    // Check if it's a markdown post
    if (!hasConfigDrivenContent(topic, slug)) {
      return !isPostPrivate(topic, slug);
    }

    // For config-driven content, include by default (no visibility check yet)
    return true;
  });

  return {
    ...group,
    items: filteredItems,
  };
}

/**
 * Filters multiple content groups
 */
export function filterPrivateContentGroups(
  groups: IContentGroup[],
  topic: string,
): IContentGroup[] {
  return groups.map((group) => filterPrivateContent(group, topic));
}
