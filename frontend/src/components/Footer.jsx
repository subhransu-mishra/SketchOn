import React from 'react'

const Footer = () => {
  return (
    <div>
     <footer className="border-t border-white/5 bg-neutral-950">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-sm font-semibold">Sketchon AI</p>
            <p className="text-sm text-white/60">
              A thoughtful whiteboard canvas with AI review and guidance.
            </p>
          </div>
          <div className="flex flex-wrap items-centergap-4 text-sm text-white/70">
            <a
              href="mailto:hello@canvas.ai"
              className="transition hover:text-white"
            >
              Contact
            </a>
            <a
              href="https://www.linkedin.com"
              className="transition hover:text-white"
            >
              LinkedIn
            </a>
            <a
              href="https://www.twitter.com"
              className="transition hover:text-white"
            >
              Twitter
            </a>
            <span className="text-white/50">
              © {new Date().getFullYear()} Sketchon AI. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer