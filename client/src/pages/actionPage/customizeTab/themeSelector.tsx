import React, { useState } from "react";

// Define the type for the image data
type ImageData = {
  id: string;
  url: string;
};

// Define props for the Image component
type ImageProps = {
  image: ImageData;
  isSelected: boolean;
  onClick: () => void;
};

// Image component
const Image: React.FC<ImageProps> = ({ image, isSelected, onClick }: ImageProps) => {
  return (
    <div
      className={`relative ${isSelected ? "border-2 border-blue-500" : ""}`}
      onClick={onClick}
    >
      <img src={image.url} alt={`${image.id}`} className="w-full h-auto" />
      {isSelected && (
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
      )}
    </div>
  );
};

// Props for the ImageSelector component
type ImageSelectorProps = {
  images: ImageData[];
  onSelect: (selectedImage: ImageData) => void;
};

// ImageSelector component
const ThemeSelector: React.FC<ImageSelectorProps> = ({ images, onSelect }) => {
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

  const handleImageClick = (image: ImageData) => {
    setSelectedImage(image);
    onSelect(image);
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((image) => (
        <Image
          key={image.id}
          image={image}
          isSelected={selectedImage?.id === image.id}
          onClick={() => handleImageClick(image)}
        />
      ))}
    </div>
  );
};

export default ThemeSelector;
