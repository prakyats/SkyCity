'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const Preloader = ({ onComplete }: { onComplete: () => void }) => {
    const ref = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const numRef = useRef<HTMLSpanElement>(null);
    const [pct, setPct] = useState(0);

    useEffect(() => {
        const val = { n: 0 };
        const tl = gsap.timeline();

        tl.to(val, {
            n: 100,
            duration: 1.8,
            ease: 'power2.inOut',
            onUpdate() {
                const v = Math.round(val.n);
                setPct(v);
                if (barRef.current) barRef.current.style.width = `${v}%`;
            },
            onComplete() {
                gsap.to(ref.current, {
                    yPercent: -100,
                    duration: 0.9,
                    ease: 'power4.inOut',
                    onComplete,
                });
            }
        });
    }, [onComplete]);

    return (
        <div ref={ref} id="preloader">
            <div style={{ textAlign: 'center' }}>
                <p className="font-display text-white"
                    style={{ fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 300, lineHeight: 1, letterSpacing: '-0.02em' }}>
                    Yamuna<em className="italic text-white/40"> Sky City</em>
                </p>
                <p className="label text-white/30 mt-3" style={{ fontSize: '0.6rem' }}>
                    Mangalore · Sea View Residences
                </p>
            </div>
            <div style={{ width: '200px', marginTop: '2rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', height: '1px', position: 'relative' }}>
                    <div ref={barRef} id="preloader-bar" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                    <span className="label text-white/20" style={{ fontSize: '0.52rem' }}>Loading</span>
                    <span className="label text-white/40" style={{ fontSize: '0.52rem' }}>
                        <span ref={numRef}>{pct}</span>%
                    </span>
                </div>
            </div>
        </div>
    );
};