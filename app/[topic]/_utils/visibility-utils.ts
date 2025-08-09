import { IContentGroup } from "../_constants/content-types";
import { isPostPrivate } from "./markdown-utils";

/**
 * Filters out private content items from a content group
 */
export function filterPrivateContent(
  group: IContentGroup,
  topic: string,
): IContentGroup {
  const filteredItems = group.items.filter((item) => {
    // Extract slug from href (e.g., '/posts/my-post' -> 'my-post')
    const slug = item.href.split("/").pop();
    if (!slug) return true;

    // Only include non-private markdown posts
    return !isPostPrivate(topic, slug);
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
