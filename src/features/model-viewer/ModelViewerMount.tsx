'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import styles from './viewer.module.css';

/**
 * Client side mount point.
 *
 * three.js touches window and WebGL at import time, so the viewer cannot be
 * server rendered. Loading it dynamically also keeps the roughly 900 KB of
 * renderer out of every other page's JavaScript bundle, which matters because
 * the homepage never needs it.
 */
const ModelViewer = dynamic(
  () => import('./ModelViewer').then((mod) => mod.ModelViewer),
  {
    ssr: false,
    loading: () => (
      <div className={styles.root}>
        <div className={styles.status}>
          <p className={styles.statusLabel}>Preparing the viewer</p>
          <div className={styles.progressTrack}>
            <span className={styles.progressFill} style={{ transform: 'scaleX(0.05)' }} />
          </div>
        </div>
      </div>
    ),
  },
);

export default function ModelViewerMount(props: {
  eyebrow?: string;
  title?: string;
}) {
  return <ModelViewer {...props} />;
}
