import { useState } from 'react'
import { usePage } from '../usePage.ts'
import Icon, { type IconName } from '../Icon.tsx'
import { FACILITIES, MAP, MEETUP, SSD } from '../links.ts'

interface Slide {
  src: string
  alt: string
}

const SLIDES: Slide[] = [
  { src: 'hero-1.jpg', alt: 'The metal shop with red tool chests, parts drawers and a CNC mill' },
  { src: 'hero-2.jpg', alt: 'The wood shop with a table saw, a miter saw and green and wood cabinets on the wall' },
  { src: 'hero-3.jpg', alt: 'The classroom with a long table set up with soldering stations and a TV on the wall' },
]

interface Shop {
  name: string
  icon: IconName
  text: string
}

const SHOPS: Shop[] = [
  { name: 'Wood Shop', icon: 'hammer', text: 'Table saws, hand tools and a 4 by 8 foot ShopBot CNC router.' },
  { name: 'Pottery Studio', icon: 'mug', text: 'Wheels, clay, drying racks and a kiln to fire your work.' },
  { name: 'Metal Shop', icon: 'wrench', text: 'Welding, a mill and a lathe, and a 4-axis CNC mill.' },
  { name: 'And More!', icon: 'sparkle', text: 'Electronics, sewing, 3D printing and a lot more.' },
]

interface Post {
  id: number
  title: string
  category: 'Project Spotlights' | 'Uncategorized'
  date: string
  dateTime: string
  author: string
  authorId: number
  text: string
  img?: { src: string; alt: string; w: number; h: number }
}

const CATEGORY_LINKS: Record<Post['category'], string> = {
  'Project Spotlights': SSD + '?cat=3',
  Uncategorized: SSD + '?cat=1',
}

const POSTS: Post[] = [
  {
    id: 2088, title: 'September Project Roundup', category: 'Project Spotlights',
    date: 'Oct, Mon, 2026', dateTime: '2026-10', author: 'Andrew Morton', authorId: 148,
    text: 'A hexagon cutting board, a stand for a fish tank, a matching end table and lamp, and more from last month.',
  },
  {
    id: 2002, title: 'Summer Project Roundup', category: 'Project Spotlights',
    date: 'Sep, Fri, 2026', dateTime: '2026-09', author: 'Andrew Morton', authorId: 148,
    text: 'A horse jump from the wood shop, a laser cut dice box, cat ears for a bike helmet and more.',
  },
  {
    id: 1987, title: '2025 Annual Financial Report', category: 'Uncategorized',
    date: 'Jun, Tue, 2026', dateTime: '2026-06', author: 'Bailey, James', authorId: 15,
    text: 'SSD is a nonprofit, so we share where our money comes from and where it goes. You can download the full report.',
  },
  {
    id: 1969, title: 'May Project Roundup', category: 'Project Spotlights',
    date: 'Jun, Sun, 2026', dateTime: '2026-06', author: 'Andrew Morton', authorId: 148,
    text: 'Porcelain tiles cast in a 3D printed mold and set in a laser cut frame, plus more from May.',
  },
  {
    id: 1914, title: 'March & April Projects', category: 'Project Spotlights',
    date: 'May, Sat, 2026', dateTime: '2026-05', author: 'Andrew Morton', authorId: 148,
    text: 'Clay tiles in a CNC cut frame, a dry erase board, a pasta machine turned into a printing press and more.',
  },
  {
    id: 1878, title: 'February Project Roundup', category: 'Project Spotlights',
    date: 'Mar, Tue, 2026', dateTime: '2026-03', author: 'Andrew Morton', authorId: 148,
    text: 'A walnut frame for a painting of a lake, a ceramic bowl and more from February.',
    img: { src: 'post-february.jpg', w: 800, h: 609, alt: 'A painting of a lake at sunset with reeds and flying birds in a wood frame' },
  },
  {
    id: 1836, title: 'January Project Roundup', category: 'Project Spotlights',
    date: 'Feb, Tue, 2026', dateTime: '2026-02', author: 'Andrew Morton', authorId: 148,
    text: 'A keyboard case made of acrylic and walnut on the ShopBot, and other projects from January.',
    img: { src: 'post-january.jpg', w: 800, h: 450, alt: 'A small keyboard with dark keys in a walnut case' },
  },
  {
    id: 1828, title: 'Desktop with embedded keyboard', category: 'Project Spotlights',
    date: 'Dec, Thu, 2025', dateTime: '2025-12', author: 'Lyons, Peter', authorId: 138,
    text: 'Pete built a desk with the keyboard set into the top to help him avoid repetitive strain injuries.',
    img: { src: 'post-desk.jpg', w: 800, h: 600, alt: 'A blue desk with a monitor, a keyboard built into the top and an office chair' },
  },
  {
    id: 1790, title: 'Ceramics Projects by Maya', category: 'Project Spotlights',
    date: 'Sep, Thu, 2025', dateTime: '2025-09', author: 'Bailey, James', authorId: 15,
    text: 'Our ceramics captain Maya has been making odd little animals and pots in the new ceramics studio.',
    img: { src: 'post-ceramics.jpg', w: 800, h: 600, alt: 'A blue ceramic lizard with orange frills sitting on a wood railing' },
  },
]

function PostCard({ post }: { post: Post }) {
  const href = `${SSD}?p=${post.id}`
  const titleId = `post-${post.id}`
  return (
    <li className="post-card" aria-labelledby={titleId}>
      {post.img && (
        <img className="post-img" src={`/ssd-img/${post.img.src}`} width={post.img.w} height={post.img.h} alt={post.img.alt} />
      )}
      <div className="post-body">
        <a className="category-pill" href={CATEGORY_LINKS[post.category]}>
          {post.category}
        </a>
        <h3 id={titleId}>
          <a href={href}>{post.title}</a>
        </h3>
        <ul className="post-meta">
          <li>
            <Icon name="calendar" size={16} />
            <span className="visually-hidden">Posted </span>
            <time dateTime={post.dateTime}>{post.date}</time>
          </li>
          <li>
            <Icon name="user" size={16} />
            <span className="visually-hidden">By </span>
            <a href={`${SSD}?author=${post.authorId}`}>{post.author}</a>
          </li>
          <li>
            <Icon name="comments" size={16} />0<span className="visually-hidden"> comments</span>
          </li>
        </ul>
        <p>{post.text}</p>
        <a className="more-link" href={href}>
          Read More<span className="visually-hidden"> about {post.title}</span>
          <Icon name="arrowRight" size={16} />
        </a>
      </div>
    </li>
  )
}

export default function Home() {
  const h1Ref = usePage('Solid State Depot | A Boulder, Colorado Makerspace')
  const [slide, setSlide] = useState(0)

  return (
    <>
      <section className="hero" aria-labelledby="page-title">
        <div className="hero-photos">
          {SLIDES.map((s, i) => (
            <img
              key={s.src}
              src={`/ssd-img/${s.src}`}
              alt={s.alt}
              hidden={i !== slide}
              className={i === slide ? 'current' : undefined}
            />
          ))}
        </div>
        <div className="wrap hero-inner">
          <div className="hero-text">
            <p className="hero-pill">Thursday Night Open House</p>
            <h1 id="page-title" ref={h1Ref} tabIndex={-1}>
              Tour the Makerspace!
            </h1>
            <p>
              Every Thursday at 5 pm. Walk-ins welcome!
              <br />
              <a href={MAP}>
                5765 Arapahoe Ave Unit B
                <br />
                Boulder, CO 80303
              </a>
            </p>
            <a className="pill-button" href={MEETUP}>
              RSVP on Meetup.com
              <span className="pill-arrow" aria-hidden="true">
                <Icon name="chevronRight" size={16} />
              </span>
            </a>
          </div>
          <div className="hero-dots" role="group" aria-label="Choose a photo">
            {SLIDES.map((s, i) => (
              <button
                key={s.src}
                type="button"
                aria-pressed={i === slide}
                onClick={() => setSlide(i)}
              >
                <span className="visually-hidden">Photo {i + 1} of {SLIDES.length}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="shops" aria-labelledby="shops-title">
        <div className="wrap">
          <h2 id="shops-title" className="visually-hidden">
            Our shops
          </h2>
          <ul className="shop-cards">
            {SHOPS.map((shop) => (
              <li className="shop-card" key={shop.name}>
                <div className="shop-head">
                  <span className="shop-icon">
                    <Icon name={shop.icon} size={28} />
                  </span>
                  <h3>{shop.name}</h3>
                </div>
                <p>{shop.text}</p>
                <a className="shop-more" href={FACILITIES}>
                  <Icon name="arrowUpRight" size={20} />
                  <span className="visually-hidden">More about the {shop.name === 'And More!' ? 'other shops' : shop.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="news" aria-labelledby="news-title">
        <div className="wrap">
          <div className="news-head">
            <p className="eyebrow">News</p>
            <h2 id="news-title">See the Latest at the SSD</h2>
            <p>Want your project to show up here? Message an admin on Slack.</p>
          </div>
          <ul className="post-grid">
            {POSTS.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
