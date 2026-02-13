
import React, { useEffect, useRef, useState } from 'react';

interface ImageSequencePlayerProps {
    basePath: string;
    frameCount: number;
    extension: string;
    fps?: number;
    className?: string;
    loop?: boolean;
    placeholderFrame?: number;
}

const ImageSequencePlayer: React.FC<ImageSequencePlayerProps> = ({
    basePath,
    frameCount,
    extension,
    fps = 30,
    className = '',
    loop = true,
    placeholderFrame,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [placeholderLoaded, setPlaceholderLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const frameRef = useRef(0);
    const requestRef = useRef<number>(0);
    const lastUpdateRef = useRef<number>(0);

    // Intersection Observer to detect visibility
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (canvasRef.current) {
            observer.observe(canvasRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Preload images
    useEffect(() => {
        let loadedCount = 0;
        const loadedImages: HTMLImageElement[] = [];

        // Function to handle full loading
        const startFullPreload = () => {
            for (let i = 1; i <= frameCount; i++) {
                const img = new Image();
                const frameNumber = i.toString().padStart(3, '0');
                img.src = `${basePath}${frameNumber}${extension}`;
                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === frameCount) {
                        setIsLoaded(true);
                    }
                };
                loadedImages.push(img);
            }
            setImages(loadedImages);
        };

        if (placeholderFrame) {
            const pImg = new Image();
            const pFrameNumber = placeholderFrame.toString().padStart(3, '0');
            pImg.src = `${basePath}${pFrameNumber}${extension}`;
            pImg.onload = () => {
                setPlaceholderLoaded(true);
                startFullPreload();
            };
        } else {
            startFullPreload();
        }
    }, [basePath, frameCount, extension, placeholderFrame]);

    // Initial render for placeholder
    useEffect(() => {
        if (placeholderLoaded && !isLoaded && canvasRef.current && placeholderFrame) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const pImg = new Image();
            const pFrameNumber = placeholderFrame.toString().padStart(3, '0');
            pImg.src = `${basePath}${pFrameNumber}${extension}`;
            pImg.onload = () => {
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    const imgAspect = pImg.width / pImg.height;
                    const canvasAspect = canvas.width / canvas.height;
                    let drawWidth, drawHeight, offsetX, offsetY;

                    if (imgAspect > canvasAspect) {
                        drawHeight = canvas.height;
                        drawWidth = canvas.height * imgAspect;
                        offsetX = (canvas.width - drawWidth) / 2;
                        offsetY = 0;
                    } else {
                        drawWidth = canvas.width;
                        drawHeight = canvas.width / imgAspect;
                        offsetX = 0;
                        offsetY = (canvas.height - drawHeight) / 2;
                    }
                    ctx.drawImage(pImg, offsetX, offsetY, drawWidth, drawHeight);
                }
            };
        }
    }, [placeholderLoaded, isLoaded, basePath, extension, placeholderFrame]);

    // Animation Loop
    const animate = (time: number) => {
        if (!isVisible || !isLoaded) return;

        const deltaTime = time - lastUpdateRef.current;
        const interval = 1000 / fps;

        if (deltaTime >= interval) {
            lastUpdateRef.current = time;

            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            const currentImg = images[frameRef.current];

            if (ctx && currentImg && canvas) {
                // Clear and draw
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Draw image centered and covering the canvas (like object-fit: cover)
                const imgAspect = currentImg.width / currentImg.height;
                const canvasAspect = canvas.width / canvas.height;
                let drawWidth, drawHeight, offsetX, offsetY;

                if (imgAspect > canvasAspect) {
                    drawHeight = canvas.height;
                    drawWidth = canvas.height * imgAspect;
                    offsetX = (canvas.width - drawWidth) / 2;
                    offsetY = 0;
                } else {
                    drawWidth = canvas.width;
                    drawHeight = canvas.width / imgAspect;
                    offsetX = 0;
                    offsetY = (canvas.height - drawHeight) / 2;
                }

                ctx.drawImage(currentImg, offsetX, offsetY, drawWidth, drawHeight);

                // Update frame
                frameRef.current = (frameRef.current + 1) % frameCount;
                if (!loop && frameRef.current === 0) {
                    cancelAnimationFrame(requestRef.current);
                    return;
                }
            }
        }

        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (isVisible && isLoaded) {
            requestRef.current = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(requestRef.current);
        }

        return () => cancelAnimationFrame(requestRef.current);
    }, [isVisible, isLoaded]);

    // Handle canvas resize
    useEffect(() => {
        const handleResize = () => {
            const canvas = canvasRef.current;
            if (canvas && canvas.parentElement) {
                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = canvas.parentElement.clientHeight;
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isLoaded, placeholderLoaded]);

    return (
        <div className={`relative w-full h-full overflow-hidden ${className}`}>
            {!isLoaded && !placeholderLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    {/* Placeholder while loading */}
                    <div className="w-8 h-8 border-4 border-[#A67C37] border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            <canvas
                ref={canvasRef}
                className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded || placeholderLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
        </div>
    );
};

export default ImageSequencePlayer;
