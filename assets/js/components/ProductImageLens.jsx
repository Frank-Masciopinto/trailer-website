/**
 * ProductImageLens Component
 * Wraps product card images with the Lens zoom effect
 * Mounts on existing DOM elements rendered by Handlebars
 */

import React, { useEffect, useState } from 'react';
import { Lens } from './Lens';
import { cn } from './lib/utils';

/**
 * Component that wraps a single product image with Lens effect
 */
export function ProductImageLens({ 
    imageSrc, 
    imageAlt,
    className,
    zoomFactor = 1.4,
    lensSize = 120,
}) {
    return (
        <Lens 
            zoomFactor={zoomFactor} 
            lensSize={lensSize}
            lensColor="rgba(255, 255, 255, 0.98)"
            className={cn('w-full h-full', className)}
        >
            <img 
                src={imageSrc} 
                alt={imageAlt}
                className="w-full h-full object-contain"
                style={{
                    maxHeight: '200px',
                    borderRadius: '12px',
                }}
            />
        </Lens>
    );
}

/**
 * Component that renders multiple product images with Lens effect
 * Used when mounting to existing containers
 */
export function ProductImagesWithLens({ images }) {
    return (
        <>
            {images.map((img, index) => (
                <ProductImageLens
                    key={index}
                    imageSrc={img.src}
                    imageAlt={img.alt}
                />
            ))}
        </>
    );
}

export default ProductImageLens;

