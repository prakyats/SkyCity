// 'use client';
// import React, { useEffect, useRef, useState } from 'react';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
// import Image from 'next/image';

// const links = [
//     { label: 'Overview', href: '#overview' },
//     { label: 'Location', href: '#location' },
//     { label: 'Floor Plans', href: '#floorplans' },
//     { label: 'Amenities', href: '#amenities' },
//     { label: 'Progress', href: '#progress' },
// ];

// export const Navbar = () => {
//     const navRef = useRef<HTMLElement>(null);
//     const [open, setOpen] = useState(false);
//     const [scrolled, setScrolled] = useState(false);

//     useEffect(() => {
//         gsap.registerPlugin(ScrollTrigger);
//         gsap.set(navRef.current, { yPercent: -100, opacity: 0 });

//         ScrollTrigger.create({
//             start: `${window.innerHeight * 0.8}px top`,
//             onEnter: () => gsap.to(navRef.current,
//                 { yPercent: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }),
//             onLeaveBack: () => gsap.to(navRef.current,
//                 { yPercent: -100, opacity: 0, duration: 0.45, ease: 'power3.in' }),
//         });

//         const fn = () => setScrolled(window.scrollY > 80);
//         window.addEventListener('scroll', fn, { passive: true });
//         return () => window.removeEventListener('scroll', fn);
//     }, []);

//     const go = (href: string) => {
//         setOpen(false);
//         document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
//     };

//     return (
//         <>
//             <nav ref={navRef} className={`fixed top-0 inset-x-0 z-[90] transition-all duration-500 ${scrolled ? 'py-3 backdrop-blur-xl border-b border-white/[0.06]' : 'py-5'
//                 }`} style={{ background: scrolled ? 'rgba(4,12,22,0.9)' : 'transparent' }}>
//                 <div className="section-inner flex items-center justify-between">
//                     {/* Logo */}
//                     <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//                         className="flex items-center gap-3">
//                         <Image src="/logos/skyfavicon.png" alt="Sky City" width={36} height={36}
//                             className="h-9 w-auto object-contain" />
//                         <div className="flex flex-col leading-none">
//                             <span className="font-display text-white" style={{ fontSize: '1rem', fontWeight: 300 }}>
//                                 Yamuna Sky City
//                             </span>
//                             <span className="label text-white/30 mt-px" style={{ fontSize: '0.48rem', letterSpacing: '0.35em' }}>
//                                 Mangalore
//                             </span>
//                         </div>
//                     </button>

//                     {/* Desktop links */}
//                     <ul className="hidden md:flex items-center gap-10">
//                         {links.map(l => (
//                             <li key={l.href}>
//                                 <button onClick={() => go(l.href)} className="nav-link text-white/50 hover:text-white">
//                                     {l.label}
//                                 </button>
//                             </li>
//                         ))}
//                     </ul>

//                     {/* CTA */}
//                     <div className="hidden md:flex items-center gap-4">
//                         <button onClick={() => go('#contact')} className="btn-gold"
//                             style={{ padding: '0.6rem 1.4rem', fontSize: '0.58rem' }}>
//                             Book a Visit
//                         </button>
//                     </div>

//                     {/* Hamburger */}
//                     <button onClick={() => setOpen(!open)}
//                         className="md:hidden flex flex-col gap-[5px] p-2 z-[200] relative" aria-label="Menu">
//                         <span className={`w-6 h-[1px] bg-white block transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-[6px]' : ''}`} />
//                         <span className={`w-6 h-[1px] bg-white block transition-all duration-300 ${open ? 'opacity-0 scale-x-0' : ''}`} />
//                         <span className={`w-6 h-[1px] bg-white block transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-[6px]' : ''}`} />
//                     </button>
//                 </div>
//             </nav>

//             {/* Mobile menu */}
//             <div className={`fixed inset-0 z-[85] flex flex-col items-center justify-center transition-all duration-500 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
//                 }`} style={{ background: 'rgba(4,12,22,0.98)', backdropFilter: 'blur(20px)' }}>
//                 {links.map((l, i) => (
//                     <button key={l.href} onClick={() => go(l.href)}
//                         className="font-display text-white/80 hover:text-white transition-all mb-6"
//                         style={{
//                             fontSize: 'clamp(2rem,6vw,3.5rem)', fontWeight: 300,
//                             opacity: open ? 1 : 0,
//                             transform: open ? 'none' : 'translateY(20px)',
//                             transitionDelay: `${i * 60}ms`,
//                         }}>
//                         {l.label}
//                     </button>
//                 ))}
//                 <button onClick={() => go('#contact')} className="btn-gold mt-6">Book a Visit</button>
//             </div>
//         </>
//     );
// };