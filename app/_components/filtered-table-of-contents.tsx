import { filterPrivateContent } from "@/app/[topic]/_utils/visibility-utils";
import CONTACT_CONTENT from "@/app/_content/contact/content";
import EXPERIENCES_CONTENT from "@/app/_content/experiences/content";
import POSTS_CONTENT from "@/app/_content/posts/content";

import TableOfContentsSection from "./table-of-contents-section";

const FilteredTableOfContents = () => {
  const filteredPosts = filterPrivateContent(POSTS_CONTENT, "posts");
  const filteredExperiences = filterPrivateContent(
    EXPERIENCES_CONTENT,
    "experiences",
  );
  const filteredContact = filterPrivateContent(CONTACT_CONTENT, "contact");

  const filteredItems = [filteredPosts, filteredExperiences, filteredContact];

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        border: "1px solid #ccccbb",
      }}
      role="presentation"
    >
      <tbody>
        <tr>
          {filteredItems.map((group) => (
            <td
              key={group.title}
              style={{
                verticalAlign: "top",
                padding: "0",
                width: "33.33%",
                border: "1px solid #ccccbb",
              }}
            >
              <TableOfContentsSection group={group} href={group.href} />
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export default FilteredTableOfContents;
