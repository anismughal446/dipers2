import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './Hero.css';
import { productImageUrl } from '../utils/productContent';
import StoreImage from './StoreImage';

const slides = [
  { image: '/bp/cdn/shop/files/01-mothersday050526.png', alt: 'Baby Planet collection for mothers and little ones', badge: 'Little joys, every day', title: <>Big smiles start with <span>little things</span></>, text: 'Find playful favorites and everyday essentials for growing kids and caring parents.', link: '/shop/fashion', cta: 'Shop the collection' },
  { image: '/bp/cdn/shop/files/02-short-sets-summer26.jpg', alt: 'Colorful summer styles for children', badge: 'Sunny days, happy little looks', title: <>Make room for <span>more play</span></>, text: 'Explore comfy outfits and cheerful favorites for every little adventure.', link: '/shop/fashion', cta: 'Explore fashion' },
  { image: '/bp/cdn/shop/files/B197001008690704_ce607757-d0f0-4366-93d0-6a36ddc57290.jpg', alt: 'Everyday essentials for babies', badge: 'Thoughtful picks for growing families', title: <>Everyday made <span>more wonderful</span></>, text: 'From outings to cozy days at home, find essentials for life with little ones.', link: '/shop/new-arrival', cta: 'See what’s new' },
];

const Hero = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const slide = slides[activeSlide];

  const showSlide = (direction) => {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = window.setInterval(() => showSlide(1), 5000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="hero-section" aria-label="Featured collections">
      <StoreImage className="hero-img" key={slide.image} src={productImageUrl(slide.image)} alt={slide.alt} />
      <div className="hero-shade" />
      <div className="hero-inner container" key={`copy-${activeSlide}`}>
        <div className="hero-content">
          <span className="hero-badge">✦ {slide.badge}</span>
          <h1>{slide.title}</h1>
          <p>{slide.text}</p>
          <Link to={slide.link} className="btn btn-primary">
            {slide.cta} <ArrowRight size={18} />
          </Link>
        </div>
      </div>
      <div className="hero-controls">
        <button className="hero-arrow" type="button" aria-label="Previous banner" onClick={() => showSlide(-1)}><ArrowLeft size={18} /></button>
        <div className="hero-dots" aria-label="Choose featured collection">
          {slides.map((item, index) => (
            <button key={item.image} type="button" className={`hero-dot ${index === activeSlide ? 'active' : ''}`} aria-label={`Show banner ${index + 1}`} aria-current={index === activeSlide ? 'true' : undefined} onClick={() => setActiveSlide(index)} />
          ))}
        </div>
        <button className="hero-arrow" type="button" aria-label="Next banner" onClick={() => showSlide(1)}><ArrowRight size={18} /></button>
      </div>
    </section>
  );
};

export default Hero;
