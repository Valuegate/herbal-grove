import { BookmarkIcon } from '@/components/ui/icons';

interface SavedPostsProps {
  darkMode: boolean;
  searchQuery: string;
}

const mySavedBlogs = [
  {
    id: 1,
    title: "Understanding Turmeric: Science-Backed Benefits and Safe Usage",
    tag: "Education",
    thumbnail: ""
  },
  {
    id: 2,
    title: "Understanding Tusil: Science-Backed Benefits and Safe Usage",
    tag: "Research",
    thumbnail: ""
  }
]

export default function SavedPosts ({ darkMode, searchQuery}: SavedPostsProps) {

  //Search Functionality
  const filterBlogs = mySavedBlogs.filter(blog => 
    blog.title.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()) || 
    blog.tag.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
  );

  if (filterBlogs.length === 0) {
    return (
      <div className={`
        flex flex-col items-center justify-center text-center py-12 px-6
        ${darkMode ? 'bg-[#222224] border-neutral-800/80'
          : 'bg-white border-gray-200/80'
        }  
      `}>
        <div className="space-y-1 max-w-xs">
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-[#222224]'}`}>
            No Saved Posts Found
          </h3>
          <p className={`text-sm ${darkMode ? 'text-white' : 'text-[#222224]'}`}>
            We could not find any saved posts matching "{searchQuery}". Try something else.
          </p>
        </div>
      </div>
    )
  }

  return (
    //Saved Posts
    <div className="space-y-4">
      <div className='px-1 flex items-center justify-between'>
        <span className={`text-sm font-extrabold uppercase tracking-wider ${darkMode ? 'text-white' : 'text-[#222224]'}`}>
          Saved Articles ({filterBlogs.length})
        </span>
      </div>

      <div>
        {filterBlogs.map((blog) => (
          //thumbnail
          <div key={blog.id} className={`p-5 flex items-center justify-between gap-4 ${darkMode ? 'hover:bg-[#2b2b2b]' : 'hover:bg-gray-200'}`}>
            <div className='flex items-center gap-4'>
              <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-lg shadow-inner shrink-0 border border-red-950 select-none">
                <span>{blog.thumbnail}</span>
              </div>

              {/*Title & Tag*/}
              <div className="space-y-0.5">
                  <h4 className={`text-sm font-semibold leading-snug line-clamp-1 md:line-clamp-none ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                    {blog.title}
                  </h4>
                  <span className={`block text-[11px] font-sm ${darkMode ? 'text-neutral-400' : 'text-gray-400'}`}>
                    {blog.tag}
                  </span>
                </div>
              </div>

              {/*Bookmark Button*/}
              <button className="hover:scale-110 active:scale-95 transition p-1.5 rounded-lg shrink-0"
                aria-label="Remove bookmark"
              >
                <BookmarkIcon />
              </button>
            </div>
        ))}
      </div>
    </div>
  )
}