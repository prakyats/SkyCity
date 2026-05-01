'use client';
import { useEffect } from 'react';
import gsap from 'gsap';

export const MagneticCursor = () => {
    useEffect(() => {
        const cursor = document.createElement('div');
        cursor.id = 'magnetic-cursor';
        document.body.appendChild(cursor);

        let mouseX = 0, mouseY = 0;
        let curX = 0, curY = 0;

        const onMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const render = () => {
            curX += (mouseX - curX) * 0.12;
            curY += (mouseY - curY) * 0.12;
            gsap.set(cursor, { x: curX, y: curY });
            requestAnimationFrame(render);
        };
        render();

        document.addEventListener('mousemove', onMove);

        // Expand on interactive elements
        const interactives = document.querySelectorAll('a, button, [data-cursor-expand]');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('expanded'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('expanded'));
        });

        return () => {
            document.removeEventListener('mousemove', onMove);
            cursor.remove();
        };
    }, []);

    return null;
};