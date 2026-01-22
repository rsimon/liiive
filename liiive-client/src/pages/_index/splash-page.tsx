import { useState } from 'react';
import { Braces, MessagesSquare, Users, Wand } from 'lucide-react';
import { SiGithub } from '@icons-pack/react-simple-icons';
import type { User } from '@annotorious/core';
import { AnimatedGlow, GridPattern, IIIFImporter } from '../../components';
import { SplashPageAccountActions } from './splash-page-account-actions';

import './splash-page.css';

export const SplashPage = () => {

  const [me, setMe] = useState<User | undefined>();

  return (
    <div className="font-dosis splash-page text-white bg-sky-950 w-full flex flex-col tracking-wide">
      <SplashPageAccountActions 
        me={me}
        onAuthenticated={setMe} />

      <main>
        <AnimatedGlow className="top-4!" />
        <GridPattern className="grid-pattern" />

        <section className="relative flex flex-col items-center mt-28 z-20 w-full hero">
          <h1 className="text-7xl font-extrabold drop-shadow-md tracking-wider">
            l<span style={{ color: 'var(--iiif-blue)' }}>i</span><span style={{ color: 'var(--iiif-red)' }}>i</span><span style={{ color: 'var(--iiif-blue)' }}>i</span>ve
          </h1>

          <div 
            className="text-gray-900 text-lg text-center mb-12 mt-2 tracking-wider drop-shadow-lg max-w-[90%]" style={{ color: '#fff' }}>
            Real-time collaborative viewing & annotation for IIIF image collections
          </div> 

          <IIIFImporter 
            me={me}
            className="flex justify-center shadow-lg max-w-[90%] w-150" />
        </section>

        <section id="features" className="relative z-10 py-28 mb-6 px-4 md:px-6 lg:px-8 tracking-wider">
          <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/5 drop-shadow-md rounded-lg p-6 backdrop-blur-xs">
                <div className="flex items-center mb-4">
                  <Users className="mr-3" size={22} />
                  <h3 className="text-xl font-medium">Collaborative Viewing</h3>
                </div>
                <p className="text-white/70">
                  Navigate IIIF materials like you're in the same room. Watch your teammates' 
                  cursors and see which pages they're exploring.
                </p>
              </div>

              <div className="bg-white/5 drop-shadow-md rounded-lg p-6 backdrop-blur-xs">
                <div className="flex items-center mb-4">
                  <MessagesSquare className="mr-3" size={22} />
                  <h3 className="text-xl font-medium">Real-Time Annotation</h3>
                </div>
                <p className="text-white/70">
                  Use drawing tools to select image regions. Add comments, replies, and engage in live discussions. 
                </p>
              </div>

              <div className="bg-white/5 drop-shadow-md rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Braces className="mr-3" size={22} />
                  <h3 className="text-xl font-medium">Standards Support</h3>
                </div>
                <p className="text-white/70">
                  Works with IIIF Presentation and Image API version 2 and 3. Supports 
                  pre-rendered IIIF Level 0 tilesets.
                </p>
              </div>

              <div className="bg-white/5 drop-shadow-md rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Wand className="mr-3" size={22} />
                  <h3 className="text-xl font-medium">Get Started Instantly</h3>
                </div>
                <p className="text-white/70">
                  Paste a manifest URL in the search box and start collaborating. Right now. 
                  Even without a login.
                </p>
              </div>
            </div>

            <p className="text-center text-sm max-w-xl mx-auto text-white/70 mt-6 leading-relaxed">
              New to IIIF? IIIF is an open standard used by museums, libraries, and archives to share high-resolution images
              online. <a href="https://iiif.io" className="text-blue-300 hover:underline" target="_blank">Learn more</a>.
            </p>
          </div>
        </section>

        <section id="how-it-works" className="relative pt-14 pb-20 px-4 md:px-6 lg:px-8 bg-transparent">
          <div className="absolute inset-0 bg-white/90 transform -skew-y-2 origin-center z-0" />

          <div className="container mx-auto relative z-10 text-sky-900">
            <h2 className="text-xl md:text-4xl font-semibold mb-10 text-center tracking-wider">
              How It Works
            </h2>
            
            <div className="w-fit mx-auto mb-2 relative space-y-2">
              <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-sky-950"></div>
              {[
                "Paste any URL to a IIIF Presentation or Image manifest in the search box.",
                "Hit the 'Go liiive' button.",
                "Share your unique room link with others.",
                "Collaborate instantly - even without creating an account!",
                "Download your annotations as standard IIIF manifests."
              ].map((step, index) => (
                <div key={index} className="relative pl-16 pb-8 last:pb-0 flex items-center">
                  <div className="absolute left-0 w-10 h-10 bg-sky-950 text-white rounded-full flex items-center justify-center text-lg">
                    {index + 1}
                  </div>

                  <p className="text-lg font-medium">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="use-cases" className="px-4 py-24 md:px-6 lg:px-8 tracking-wider">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-4xl text-center mb-8">Perfect For</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6">
                <h3 className="text-xl font-medium mb-2">Distributed Research Teams</h3>
                <p className="text-white/70">
                  Bridge geographical gaps in collaborative research. Share discoveries, annotate research materials, streamline your team's workflow across institutions.
                </p>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-medium mb-2">Virtual Classrooms</h3>
                <p className="text-white/70">
                  Explore visual materials together with students in real-time to enhance engagement and understanding.
                </p>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-medium mb-2">Art History Seminars</h3>
                <p className="text-white/70">
                  Examine artworks together. Trace details, highlight stylistic elements, compare techniques, and discuss as a group.
                </p>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-medium mb-2">Manuscript Studies</h3>
                <p className="text-white/70">
                  Analyze historical texts collaboratively. Compare versions, mark significant passages, share interpretations, create annotated study guides.
                </p>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-medium mb-2">Conservation & Documentation</h3>
                <p className="text-white/70">
                  Facilitate remote conservation assessments. Annotate areas of concern and share observations instantly.
                </p>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-medium mb-2">Digital Exhibitions</h3>
                <p className="text-white/70">
                  Prepare material for engaging online exhibitions. Create annotations that guide visitors 
                  through virtual collections.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10 px-4 md:px-6 lg:px-8 bg-black/25 text-white font-light leading-relaxed">
        <div className="container mx-auto">
          <div className="lg:flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-3 p-6">
              <p className="flex gap-2.5 items-center">
                <a 
                  href="https://github.com/rsimon"
                  target="_blank">
                  <SiGithub className="size-5"/>
                </a>

                <span>
                  Brought to you by <a className="text-blue-300 hover:underline" href="https://rainersimon.io" target="_blank" rel="noopener noreferrer">rainersimon.io</a>. 
                </span>
              </p>
            </div>

            <div className="grow-5 p-6"></div>

            <div className="grow p-6"></div>
          </div>
        </div>
      </footer>
    </div>
  )

}
