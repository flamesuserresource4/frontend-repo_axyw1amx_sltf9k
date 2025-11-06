import React from 'react';
import Spline from '@splinetool/react-spline';
import { Rocket, Wallet } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 pt-20 pb-16 sm:pt-28 lg:flex-row lg:items-center lg:gap-12">
        <div className="text-center lg:text-left lg:w-1/2">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-white/60 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-slate-200">
            <Wallet className="h-4 w-4" />
            Offline-first personal finance
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-white">
            Take control of your spending — privately, on your device
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg dark:text-slate-300">
            Track expenses, set budgets, visualize trends, and export your data. No sign-ups.
            No cloud. Your finances stay on your phone.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <a
              href="#get-started"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              <Rocket className="h-4 w-4" />
              Get Started
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Explore Features
            </a>
          </div>
        </div>

        <div className="mt-14 w-full lg:mt-0 lg:w-1/2">
          <div className="relative mx-auto aspect-[4/3] max-w-xl overflow-hidden rounded-2xl border border-slate-200/60 bg-white/70 shadow-lg backdrop-blur-lg dark:border-slate-700/60 dark:bg-slate-800/70">
            {/* Gradient overlay that won't block interactions with Spline */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-white/20 dark:from-slate-900/40 dark:to-slate-900/20" />
            <div className="absolute inset-0 grid place-items-center p-6">
              <div className="rounded-xl border border-slate-200/60 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/70">
                <div className="text-center text-sm font-medium text-slate-600 dark:text-slate-300">
                  Live 3D card preview behind — try dragging!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
