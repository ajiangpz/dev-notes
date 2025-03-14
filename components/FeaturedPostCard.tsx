import Link from 'next/link';
import Image from 'next/image';
import { Blog } from '@/.contentlayer/generated';

export default function FeaturedPostCard({ post }: { post: Blog }) {
  return (
    <div className="relative h-80 overflow-hidden rounded-xl group">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10"></div>
      {post.images ? (
        <Image 
          src={post.images[0]} 
          alt={post.title} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags && post.tags.slice(0, 2).map(tag => (
            <span key={tag} className="inline-block rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="mb-2 text-xl font-bold text-white">{post.title}</h3>
        <p className="mb-4 text-white/80 line-clamp-2">{post.description}</p>
        <Link 
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-white hover:underline"
        >
          阅读全文 <span className="ml-1">→</span>
        </Link>
      </div>
    </div>
  );
} 