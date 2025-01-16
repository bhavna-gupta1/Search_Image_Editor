import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom"; 
import * as fabric from "fabric"; 

const CanvasEditor = () => {
  const { state } = useLocation(); 
  const { imageUrl } = state || {}; 
  const canvasRef = useRef(null); 
  const [canvas, setCanvas] = useState(null); 
  const [caption, setCaption] = useState(""); 

 
  useEffect(() => {
    if (!imageUrl) return; 
   
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
    });

    
    setCanvas(fabricCanvas);

   
    fabric.Image.fromURL(imageUrl, { crossOrigin: "anonymous" }).then((img) => {
      img.scaleToWidth(800); 
      img.set({ left: 0, top: 0, selectable: true }); 
      fabricCanvas.add(img); 
      fabricCanvas.setActiveObject(img); 
      logCanvasLayers(fabricCanvas); 
    });

    
    fabricCanvas.selection = true;


    return () => {
      if (fabricCanvas) {
        fabricCanvas.dispose();
      }
    };
  }, [imageUrl]); 

  
  const addText = () => {
    if (!canvas || !caption) return; 

    const text = new fabric.Textbox(caption, {
      left: 50,
      top: 50,
      width: 200,
      fontSize: 20,
      fill: "#000",
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    logCanvasLayers(canvas); 
  };
  const addShape = (shapeType) => {
    if (!canvas) return;

    let shape;
    switch (shapeType) {
      case "triangle":
        shape = new fabric.Triangle({
          width: 100,
          height: 100,
          left: 150,
          top: 150,
          fill: "red",
        });
        break;
      case "circle":
        shape = new fabric.Circle({
          radius: 50,
          left: 200,
          top: 200,
          fill: "blue",
        });
        break;
      case "rectangle":
        shape = new fabric.Rect({
          width: 150,
          height: 100,
          left: 250,
          top: 100,
          fill: "green",
        });
        break;
      case "polygon":
        shape = new fabric.Polygon(
          [
            { x: 150, y: 100 }, 
            { x: 200, y: 150 }, 
            { x: 175, y: 200 }, 
            { x: 125, y: 200 }, 
            { x: 100, y: 150 }, 
          ],
          {
            left: 350,
            top: 200,
            fill: "purple",
          }
        );
        break;
      default:
        break;
    }

    if (shape) {
      canvas.add(shape);
      canvas.setActiveObject(shape);
      logCanvasLayers(canvas); 
    }
  };

  
  const logCanvasLayers = (fabricCanvas) => {
    const objects = fabricCanvas.getObjects();
    const layersInfo = objects.map((obj) => {
      if (obj.type === 'image') {
        return {
          type: obj.type,
          left: obj.left,
          top: obj.top,
          width: obj.width,
          height: obj.height,
          scaleX: obj.scaleX,
          scaleY: obj.scaleY,
        };
      } else if (obj.type === 'text') {
        return {
          type: obj.type,
          left: obj.left,
          top: obj.top,
          width: obj.width,
          height: obj.height,
          fontSize: obj.fontSize,
          text: obj.text,
        };
      } else if (obj.type === 'triangle' || obj.type === 'circle' || obj.type === 'rect' || obj.type === 'polygon') {
        return {
          type: obj.type,
          left: obj.left,
          top: obj.top,
          width: obj.width,
          height: obj.height,
          fill: obj.fill,
        };
      }
      return {}; 
    });

    console.log("Canvas Layers and their attributes:", layersInfo);
  };

  
  const downloadImage = () => {
    if (!canvas) return; 
  
    
    canvas.getElement().toBlob((blob) => {
      if (!blob) {
        console.error("Failed to generate image blob.");
        return;
      }
  
      
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob); 
      link.download = "canvas-image.png"; 
      link.click(); 
    }, "image/png"); 
  };
  
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
      <div style={{ flex: 1, marginRight: "20px" }}>
        
        <canvas ref={canvasRef} id="image-canvas" style={{ border: "1px solid #ddd" }}></canvas>
      </div>

      <div style={{ flex: 1 }}>
      
        <h2>Add Caption</h2>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)} 
          placeholder="Type your caption here"
          style={{
            width: "100%",
            height: "150px",
            padding: "10px",
            marginBottom: "20px",
            fontSize: "16px",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        ></textarea>

        <button
          onClick={addText} 
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          Add Caption to Image
        </button>

        <h3>Add Shapes</h3>
        <div style={{ display: "flex", marginBottom: "20px" }}>
          <button
            onClick={() => addShape("triangle")}
            style={shapeButtonStyle}
          >
            Triangle
          </button>
          <button
            onClick={() => addShape("circle")}
            style={shapeButtonStyle}
          >
            Circle
          </button>
          <button
            onClick={() => addShape("rectangle")}
            style={shapeButtonStyle}
          >
            Rectangle
          </button>
          <button
            onClick={() => addShape("polygon")}
            style={shapeButtonStyle}
          >
            Polygon
          </button>
        </div>

        <button
          onClick={downloadImage} 
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Download Image
        </button>
      </div>
    </div>
  );
};


const shapeButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#17a2b8",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginRight: "10px",
};

export default CanvasEditor;
