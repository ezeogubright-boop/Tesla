import { useEffect, useRef, useState } from 'react';
import { Home, Globe, Menu, Moon, Search, Car, User, Share2, Bookmark, GitCompare, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CarViewer3D } from './CarViewer3D';

const carModels = [
  { id: 1, name: 'Cybertruck', tagline: 'Stainless Steel Exoskeleton', price: '$60,990', modelPath: '/models/tesla_cybertruck.glb' },
  { id: 2, name: 'Model S', tagline: 'Dual Motor AWD', price: '$73,990', modelPath: '/models/tesla_roadster_2020.glb' },
];

export function ShowroomPage() {
  const [currentCar, setCurrentCar] = useState(0);
  const [carRotation, setCarRotation] = useState(-0.35);
  const [isDragging, setIsDragging] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const knobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNext = () => {
    setCurrentCar((prev) => (prev + 1) % carModels.length);
  };

  const handlePrev = () => {
    setCurrentCar((prev) => (prev - 1 + carModels.length) % carModels.length);
  };

  const handleSliderMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartAngle(e.clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - startAngle;
      const rotationDelta = (deltaX / 256) * (Math.PI * 2);
      setCarRotation((prev) => prev + rotationDelta);
      setStartAngle(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startAngle]);

  return (
    <div 
      className="relative min-h-screen w-full bg-black"
      style={{
        backgroundImage: 'url(/showroom.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Content Wrapper */}
      <div className="relative z-10">
      {/* Custom Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-3 xs:px-4 sm:px-8 lg:px-12 py-3 xs:py-4 sm:py-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
          {/* Left - Logo */}
          <Link to="/" className="text-lg xs:text-xl sm:text-2xl font-bold tracking-wider text-white truncate">
            TESLA
          </Link>

          {/* Center - Navigation Icons */}
          <div className="hidden sm:flex items-center gap-4 sm:gap-6">
            <button className="flex items-center justify-center transition-all text-gray-400 hover:text-white p-1">
              <Home className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button className="flex items-center justify-center transition-all text-gray-400 hover:text-white p-1">
              <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button className="flex items-center justify-center transition-all text-gray-400 hover:text-white p-1">
              <Menu className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Right - Action Icons */}
          <div className="flex items-center gap-2 xs:gap-3 sm:gap-6">
            <button className="flex items-center justify-center transition-all text-gray-400 hover:text-white p-1">
              <Moon className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button className="flex items-center justify-center transition-all text-gray-400 hover:text-white p-1">
              <Search className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <Link to="/" className="flex items-center justify-center transition-all text-gray-400 hover:text-white p-1">
              <Car className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
            <button className="flex items-center justify-center transition-all text-gray-400 hover:text-white p-1">
              <User className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 360 Rotation Knob - Left Side Fixed Position (Hidden on Mobile) */}
      <div className="fixed hidden sm:flex left-2 xs:left-4 sm:left-6 lg:left-8 z-40 flex-col items-center gap-3 xs:gap-4 sm:gap-5" style={{ top: '70%', transform: 'translateY(-50%)' }}>
        {/* Knob Section */}
        <div className="flex flex-col items-center gap-3 xs:gap-4 w-full">
          {/* Horizontal Slider */}
          <div 
            ref={knobRef}
            onMouseDown={handleSliderMouseDown}
            className="relative w-full xs:w-56 sm:w-64 h-16 xs:h-20 flex flex-col items-center justify-center gap-3"
            style={{ cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none', maxWidth: '280px' }}
          >
            {/* Slider Track Container */}
            <div className="relative w-full px-5 xs:px-6">
              {/* Background Track */}
              <div className="relative h-6 xs:h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full overflow-hidden shadow-lg flex items-center">
                {/* Gray unfilled portion on the right */}
                <div
                  className="absolute top-0 right-0 h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full"
                  style={{
                    width: `${100 - (((carRotation - (-0.35)) / (Math.PI * 2)) % 1) * 100}%`,
                    transition: isDragging ? 'none' : 'width 0.1s ease-out',
                  }}
                />

                {/* Slider Thumb - Liquid Glass UI */}
                <div
                  className="absolute top-1/2 w-10 xs:w-12 h-10 xs:h-12 rounded-lg xs:rounded-xl transition-transform group"
                  style={{
                    left: `${(((carRotation - (-0.35)) / (Math.PI * 2)) % 1) * 100}%`,
                    transform: 'translate(calc(-50% + 20px), -50%)',
                    transition: isDragging ? 'none' : 'left 0.1s ease-out',
                  }}
                >
                  {/* Liquid Glass Background */}
                  <div
                    className="absolute inset-0 rounded-lg xs:rounded-xl overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.5) 50%, rgba(200,230,255,0.4) 100%)',
                      backdropFilter: 'blur(18px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      boxShadow: `
                        inset 0 1px 3px rgba(255,255,255,0.6),
                        inset -1px -1px 3px rgba(0,0,0,0.1),
                        0 8px 32px rgba(31,38,135,0.25),
                        0 4px 16px rgba(0,0,0,0.15),
                        0 0 0 1px rgba(255,255,255,0.3) inset
                      `,
                      border: '1px solid rgba(255,255,255,0.4)',
                    }}
                  >
                    {/* Liquid Shimmer Effect */}
                    <div
                      className="absolute inset-0 rounded-lg xs:rounded-xl"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 20%, rgba(100,180,255,0.2) 50%, transparent 100%)',
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Center Glow */}
                    <div
                      className="absolute inset-0 rounded-lg xs:rounded-xl"
                      style={{
                        background: 'radial-gradient(circle at 30% 30%, rgba(100,180,255,0.2) 0%, transparent 70%)',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Label and Degree Display */}
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs xs:text-sm text-gray-300 font-medium tracking-wider">360° ROTATE</p>
              <p 
                className="text-2xl xs:text-3xl sm:text-4xl font-light text-blue-400"
              >
                {Math.round(((carRotation - (-0.35)) / (Math.PI * 2)) * 360 + 360) % 360}°
              </p>
              <p className="text-xs text-gray-500">Drag to rotate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination UI - Right Side Fixed Position (Hidden on Mobile) */}
      <div className="fixed hidden sm:flex right-2 xs:right-4 sm:right-6 lg:right-8 z-40 flex-col items-center gap-3 xs:gap-4" style={{ top: '70%', transform: 'translateY(-50%)' }}>
        {/* Progress Bar with Label */}
        <div className="flex flex-col items-center gap-1.5 xs:gap-2 w-full max-w-xs">
          {/* Counter and Title */}
          <div className="flex items-center justify-between w-full px-1.5 xs:px-2.5">
            <span className="text-xs text-gray-500 font-light">
              {String(currentCar + 1).padStart(2, '0')} / {String(carModels.length).padStart(2, '0')}
            </span>
            <span className="text-xs text-gray-400 font-medium tracking-wider">
              {carModels[currentCar].name.toUpperCase()}
            </span>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full h-1 xs:h-1.5 bg-gray-800 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-white via-gray-300 to-white rounded-full transition-all duration-500 ease-out shadow-lg"
              style={{
                width: `${((currentCar + 1) / carModels.length) * 100}%`,
                boxShadow: '0 0 8px rgba(255,255,255,0.4)',
              }}
            />
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center justify-center gap-2 xs:gap-3 sm:gap-6 w-full">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            className="flex items-center justify-center w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-full border border-gray-600 text-gray-400 hover:text-white hover:border-white hover:bg-white/5 transition-all duration-200"
          >
            <ChevronLeft className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Dot Indicators */}
          <div className="flex items-center justify-center gap-1.5 xs:gap-2">
            {carModels.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentCar(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === currentCar
                    ? 'w-6 xs:w-7 h-2 xs:h-2.5 bg-white shadow-lg'
                    : 'w-1.5 xs:w-2 h-1.5 xs:h-2 bg-gray-600 hover:bg-gray-500'
                }`}
                style={{
                  transform: index === currentCar ? 'scaleY(1.2)' : 'scaleY(1)',
                }}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="flex items-center justify-center w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-full border border-gray-600 text-gray-400 hover:text-white hover:border-white hover:bg-white/5 transition-all duration-200"
          >
            <ChevronRight className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Controls - Shown only on mobile */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black via-black/95 to-transparent pt-3 pb-3">
        {/* Mobile Pagination and Slider */}
        <div className="flex items-center justify-center gap-2 px-3">
          <button
            onClick={handlePrev}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-600 text-gray-400 hover:text-white hover:border-white hover:bg-white/5"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center justify-center gap-1 flex-1">
            {carModels.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentCar(index)}
                className={`rounded-full transition-all ${index === currentCar ? 'w-5 h-1.5 bg-white' : 'w-1 h-1 bg-gray-600'}`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-600 text-gray-400 hover:text-white hover:border-white hover:bg-white/5"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Showroom */}
      <main className="pt-16 xs:pt-20 sm:pt-28 flex flex-col min-h-screen pb-32 sm:pb-0">
        {/* Product Display Section */}
        <div className="px-2 xs:px-3 sm:px-8 lg:px-12 py-3 xs:py-4 sm:py-5 flex-1">
          <div className="max-w-7xl mx-auto">
            {/* Grid Layout - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2 xs:gap-3 sm:gap-4 md:gap-6 lg:gap-12 items-start">
              {/* Left - Product Info */}
              <div className="flex flex-col justify-center space-y-1 xs:space-y-1.5 sm:space-y-2 order-2 md:order-1 md:col-span-1 mb-2 sm:mb-0">
                <h1 className="text-xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-orbitron font-extralight tracking-wider text-white leading-tight">
                  TESLA
                </h1>
                <p className="text-xs xs:text-sm sm:text-base md:text-lg font-orbitron tracking-wider text-gray-400 truncate">
                  {carModels[currentCar].name}
                </p>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {carModels[currentCar].tagline}
                </p>
              </div>

              {/* Center - 3D Car Display */}
              <div className="flex flex-col items-center justify-center order-1 md:order-2 mb-2 xs:mb-3 sm:mb-0 sm:col-span-2 md:col-span-4">
                {/* 3D Car Model Viewer */}
                <div className="w-full h-40 xs:h-56 sm:h-72 md:h-96 rounded-lg xs:rounded-2xl sm:rounded-3xl overflow-hidden">
                  <CarViewer3D 
                    key={currentCar} 
                    modelPath={carModels[currentCar].modelPath} 
                    rotationY={carRotation}
                    modelScale={currentCar === 1 ? 2.5 : 4}
                  />
                </div>
              </div>

              {/* Right - Price & Actions */}
              <div className="flex flex-col items-start sm:items-end justify-start space-y-1.5 xs:space-y-2 order-3 md:col-span-1 w-full sm:w-auto">
                <div className="text-left sm:text-right">
                  <p className="text-base xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-white truncate">
                    {carModels[currentCar].price}
                  </p>
                  <button className="text-xs mt-1 transition-colors text-gray-500 hover:text-gray-300 whitespace-nowrap">
                    All prices →
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 xs:gap-2.5 sm:flex-col">
                  <button className="flex items-center justify-center transition-all text-gray-400 hover:text-white p-1.5 hover:bg-white/5 rounded">
                    <Bookmark className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4 sm:h-4" />
                  </button>
                  <button className="flex items-center justify-center transition-all text-gray-400 hover:text-white p-1.5 hover:bg-white/5 rounded">
                    <Share2 className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4 sm:h-4" />
                  </button>
                  <button className="flex items-center justify-center transition-all text-gray-400 hover:text-white p-1.5 hover:bg-white/5 rounded">
                    <GitCompare className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
