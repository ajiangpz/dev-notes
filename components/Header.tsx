'use client'; 
import Link from './Link'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import ThemeSwitch from './ThemeSwitch'
import MobileNav from './MobileNav'
import SearchButton from './SearchButton'
import { useEffect, useState } from 'react'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 backdrop-blur supports-backdrop-blur:bg-white/95 dark:supports-backdrop-blur:bg-gray-950/95 transition-shadow ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="mx-auto flex items-center justify-between px-3 py-3 xl:px-0 max-w-5xl xl:max-w-6xl">
        <div>
          <Link href="/" aria-label="博客首页">
            <div className="flex items-center justify-between">
              <div className="mr-3">
                <Logo className="h-9 w-9" />
              </div>
              <div className="hidden h-6 text-2xl font-semibold sm:block">
                捡瓶子的博客
              </div>
            </div>
          </Link>
        </div>
        <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
          <div className="hidden sm:block">
            {headerNavLinks
              .filter((link) => link.href !== '/')
              .map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="p-1 font-medium text-gray-900 dark:text-gray-100 sm:p-4"
                >
                  {link.title}
                </Link>
              ))}
          </div>
          <SearchButton />
          <ThemeSwitch />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

export default Header
