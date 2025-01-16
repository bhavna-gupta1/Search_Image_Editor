import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import './Search.css';

const SearchImages = () => {
  const [query, setQuery] = useState(""); 
  const [images, setImages] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate(); 

  
  const handleSearch = async () => {
    setLoading(true); 
    try {
      const API_KEY = "TvN-rb3UcNjKBI4t-Unp06TKtN2QTtCL0cKubxCuUrU"; 
      const response = await axios.get(
        `https://api.unsplash.com/search/photos?query=${query}&per_page=12&client_id=${API_KEY}`
      );
      setImages(response.data.results); 
    } catch (error) {
      alert("Failed to fetch images. Please try again.");
    } finally {
      setLoading(false); 
    }
  };


  const handleAddCaption = (imageUrl) => {
    navigate("/caption-editor", { state: { imageUrl } }); 
  };

  return (
    <div className="search-container">
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Search for images..."
        style={{ padding: "10px", width: "300px", marginRight: "10px" }}
      />
    
      <button onClick={handleSearch}>Search</button>

     
      {loading && <p>Loading images...</p>}

      <div style={{ marginTop: "20px" }}>
        {images.length > 0 ? (
          <div className="image-grid">
            {images.map((img) => (
              <div key={img.id} className="image-item">
                <img
                  src={img.urls.small} 
                  alt={img.alt_description || "Image"} 
                  style={{
                    width: "100%",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                />
                
                <button
                  onClick={() => handleAddCaption(img.urls.full)} 
                  style={{
                    marginTop: "10px",
                    padding: "8px 16px",
                    backgroundColor: "#007BFF",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Add Caption
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>Seach for image</p>
        )}
      </div>
    </div>
  );
};

export default SearchImages;
