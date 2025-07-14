import { filterPrivateContent } from '@/app/[topic]/_utils/visibility-utils';
import CONTACT_CONTENT from '@/app/_content/contact/content';
import EXPERIENCES_CONTENT from '@/app/_content/experiences/content';
import POSTS_CONTENT from '@/app/_content/posts/content';

import TableOfContentsSection from './table-of-contents-section';

const FilteredTableOfContents = () => {
  // Filter each content group
  const filteredPosts = filterPrivateContent(POSTS_CONTENT, 'posts');
  const filteredExperiences = filterPrivateContent(
    EXPERIENCES_CONTENT,
    'experiences',
  );
  const filteredContact = filterPrivateContent(CONTACT_CONTENT, 'contact');

  const filteredItems = [filteredPosts, filteredExperiences, filteredContact];

  return (
    <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
      {filteredItems.map((group) => (
        <TableOfContentsSection
          key={group.title}
          group={group}
          href={group.href}
        />
      ))}
    </div>
  );
};

export default FilteredTableOfContents;
