import { createPost, createUserWithBlog, getBlogBySlug } from '../src/lib/data';

type Seed = {
  username: string;
  email: string;
  password: string;
  blogTitle: string;
  blogSlug: string;
  blogDescription: string;
  posts: { authorName: string; title: string; body: string }[];
};

const seeds: Seed[] = [
  {
    username: 'chef_maria',
    email: 'maria@example.com',
    password: 'password123',
    blogTitle: "Maria's Weeknight Kitchen",
    blogSlug: 'weeknight-kitchen',
    blogDescription: 'Fast, comforting dinners for busy weeknights — nothing fussy.',
    posts: [
      {
        authorName: 'Sam',
        title: 'One-pan lemon garlic chicken',
        body: 'Made this last night and it was a hit! I added extra garlic and served it over rice. The lemon really brightens everything up.',
      },
      {
        authorName: 'Anonymous',
        title: '15-minute miso noodles',
        body: 'These noodles saved my Tuesday. A spoon of miso, some chili oil, and greens — done before the kettle cooled.',
      },
    ],
  },
  {
    username: 'bakerben',
    email: 'ben@example.com',
    password: 'password123',
    blogTitle: 'The Sourdough Diaries',
    blogSlug: 'sourdough-diaries',
    blogDescription: 'A home baker documenting the highs and lows of wild yeast.',
    posts: [
      {
        authorName: 'Priya',
        title: 'My starter finally doubled!',
        body: 'After two weeks of sad flat goo, it doubled overnight. Warm spot on top of the fridge was the trick.',
      },
    ],
  },
  {
    username: 'spicequeen',
    email: 'nadia@example.com',
    password: 'password123',
    blogTitle: 'Fire & Spice',
    blogSlug: 'fire-and-spice',
    blogDescription: 'Bold, spicy food from around the world. Bring tissues.',
    posts: [],
  },
];

function run() {
  for (const seed of seeds) {
    if (getBlogBySlug(seed.blogSlug)) {
      console.log(`skip: ${seed.blogSlug} already exists`);
      continue;
    }

    const result = createUserWithBlog(seed);
    if (!result.ok) {
      console.log(`skip: ${seed.username} (${result.message})`);
      continue;
    }

    const blog = getBlogBySlug(seed.blogSlug);
    if (!blog) {
      continue;
    }

    for (const post of seed.posts) {
      createPost({ blogId: blog.id, ...post });
    }

    console.log(`created: @${seed.username} → /blog/${seed.blogSlug} (${seed.posts.length} posts)`);
  }

  console.log('Seed complete.');
}

run();
