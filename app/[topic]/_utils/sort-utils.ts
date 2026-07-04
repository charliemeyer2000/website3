import { IContentGroup } from "../_constants/content-types";
import { getPostDate } from "./markdown-utils";

/**
 * Sorts a content group's items by post date (newest first).
 * Items without a date keep their relative order and are placed last.
 */
export function sortContentByDate(
  group: IContentGroup,
  topic: string,
): IContentGroup {
  const datedItems = group.items.map((item) => ({
    item,
    date: getPostDate(topic, item.href.split("/").pop() ?? ""),
  }));

  const sortedItems = datedItems
    .sort((a, b) => {
      if (a.date === b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return b.date.localeCompare(a.date);
    })
    .map(({ item }) => item);

  return { ...group, items: sortedItems };
}
