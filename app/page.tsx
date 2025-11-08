'use client';

import { useState, useRef, useEffect } from 'react';

interface TextOverlay {
  id: number;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontWeight: string;
  fontFamily: string;
}

export default function Home() {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([
    {
      id: 1,
      text: 'BLACK FRIDAY 28 NËNTORI',
      x: 50,
      y: 20,
      fontSize: 48,
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontFamily: 'Arial'
    },
    {
      id: 2,
      text: 'Personalizoni shishet me logo foto shkrime sipas dëshirës',
      x: 50,
      y: 80,
      fontSize: 32,
      color: '#FFD700',
      fontWeight: 'normal',
      fontFamily: 'Arial'
    }
  ]);
  const [selectedOverlay, setSelectedOverlay] = useState<number | null>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setIsPlaying(false);
    }
  };

  const updateOverlay = (id: number, updates: Partial<TextOverlay>) => {
    setTextOverlays(prev =>
      prev.map(overlay =>
        overlay.id === id ? { ...overlay, ...updates } : overlay
      )
    );
  };

  const addNewTextOverlay = () => {
    const newId = Math.max(...textOverlays.map(o => o.id), 0) + 1;
    setTextOverlays([
      ...textOverlays,
      {
        id: newId,
        text: 'New Text',
        x: 50,
        y: 50,
        fontSize: 32,
        color: '#FFFFFF',
        fontWeight: 'normal',
        fontFamily: 'Arial'
      }
    ]);
    setSelectedOverlay(newId);
  };

  const removeOverlay = (id: number) => {
    setTextOverlays(prev => prev.filter(o => o.id !== id));
    if (selectedOverlay === id) {
      setSelectedOverlay(null);
    }
  };

  const drawTextOnCanvas = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    textOverlays.forEach(overlay => {
      ctx.font = `${overlay.fontWeight} ${overlay.fontSize}px ${overlay.fontFamily}`;
      ctx.fillStyle = overlay.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Add text shadow for better visibility
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      const x = (canvas.width * overlay.x) / 100;
      const y = (canvas.height * overlay.y) / 100;

      ctx.fillText(overlay.text, x, y);
    });
  };

  useEffect(() => {
    let animationId: number;
    const animate = () => {
      if (isPlaying) {
        drawTextOnCanvas();
        animationId = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      animate();
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPlaying, textOverlays]);

  const downloadVideo = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // For demo purposes, download current frame as image
    // Full video rendering would require ffmpeg.wasm or server-side processing
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'video-frame-with-text.png';
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  const selectedOverlayData = textOverlays.find(o => o.id === selectedOverlay);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{
          color: 'white',
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '42px',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          🎬 Video Text Overlay Editor
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '20px',
          alignItems: 'start'
        }}>
          {/* Video Preview Section */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '12px 24px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginRight: '10px'
                }}
              >
                📁 Upload Video
              </button>

              {videoUrl && (
                <>
                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        if (isPlaying) {
                          videoRef.current.pause();
                        } else {
                          videoRef.current.play();
                        }
                        setIsPlaying(!isPlaying);
                      }
                    }}
                    style={{
                      padding: '12px 24px',
                      background: isPlaying ? '#f59e0b' : '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      marginRight: '10px'
                    }}
                  >
                    {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                  </button>

                  <button
                    onClick={downloadVideo}
                    style={{
                      padding: '12px 24px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    💾 Download Frame
                  </button>
                </>
              )}
            </div>

            <div style={{ position: 'relative', background: '#000', borderRadius: '8px', overflow: 'hidden' }}>
              {videoUrl ? (
                <>
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    style={{ width: '100%', display: 'block' }}
                    onLoadedMetadata={drawTextOnCanvas}
                    onTimeUpdate={drawTextOnCanvas}
                  />
                  <canvas
                    ref={canvasRef}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none'
                    }}
                  />
                </>
              ) : (
                <div style={{
                  padding: '100px 20px',
                  textAlign: 'center',
                  color: '#666',
                  background: '#f3f4f6'
                }}>
                  <p style={{ fontSize: '24px', margin: 0 }}>📹</p>
                  <p style={{ margin: '10px 0 0 0' }}>Upload a video to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* Controls Section */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>Text Overlays</h2>

            <button
              onClick={addNewTextOverlay}
              style={{
                width: '100%',
                padding: '12px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '20px'
              }}
            >
              ➕ Add Text Layer
            </button>

            <div style={{ marginBottom: '20px' }}>
              {textOverlays.map(overlay => (
                <div
                  key={overlay.id}
                  onClick={() => setSelectedOverlay(overlay.id)}
                  style={{
                    padding: '10px',
                    marginBottom: '10px',
                    background: selectedOverlay === overlay.id ? '#e0e7ff' : '#f3f4f6',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: selectedOverlay === overlay.id ? '2px solid #667eea' : '2px solid transparent',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                    {overlay.text.substring(0, 30)}...
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeOverlay(overlay.id);
                    }}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {selectedOverlayData && (
              <div>
                <h3 style={{ marginBottom: '15px', color: '#333' }}>Edit Selected Text</h3>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                    Text:
                  </label>
                  <textarea
                    value={selectedOverlayData.text}
                    onChange={(e) => updateOverlay(selectedOverlayData.id, { text: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid #ddd',
                      fontSize: '14px',
                      minHeight: '60px',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                      X Position (%):
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={selectedOverlayData.x}
                      onChange={(e) => updateOverlay(selectedOverlayData.id, { x: Number(e.target.value) })}
                      style={{ width: '100%' }}
                    />
                    <span style={{ fontSize: '12px' }}>{selectedOverlayData.x}%</span>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                      Y Position (%):
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={selectedOverlayData.y}
                      onChange={(e) => updateOverlay(selectedOverlayData.id, { y: Number(e.target.value) })}
                      style={{ width: '100%' }}
                    />
                    <span style={{ fontSize: '12px' }}>{selectedOverlayData.y}%</span>
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                    Font Size:
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="120"
                    value={selectedOverlayData.fontSize}
                    onChange={(e) => updateOverlay(selectedOverlayData.id, { fontSize: Number(e.target.value) })}
                    style={{ width: '100%' }}
                  />
                  <span style={{ fontSize: '12px' }}>{selectedOverlayData.fontSize}px</span>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                    Color:
                  </label>
                  <input
                    type="color"
                    value={selectedOverlayData.color}
                    onChange={(e) => updateOverlay(selectedOverlayData.id, { color: e.target.value })}
                    style={{ width: '100%', height: '40px', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                    Font Weight:
                  </label>
                  <select
                    value={selectedOverlayData.fontWeight}
                    onChange={(e) => updateOverlay(selectedOverlayData.id, { fontWeight: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid #ddd',
                      fontSize: '14px'
                    }}
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                  </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                    Font Family:
                  </label>
                  <select
                    value={selectedOverlayData.fontFamily}
                    onChange={(e) => updateOverlay(selectedOverlayData.id, { fontFamily: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid #ddd',
                      fontSize: '14px'
                    }}
                  >
                    <option value="Arial">Arial</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Impact">Impact</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.9)',
          borderRadius: '12px',
          padding: '20px',
          marginTop: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
        }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>ℹ️ Instructions</h3>
          <ul style={{ lineHeight: '1.8', color: '#555' }}>
            <li>Upload your video using the "Upload Video" button</li>
            <li>Edit the pre-loaded Black Friday text or add new text layers</li>
            <li>Customize position, size, color, and font for each text layer</li>
            <li>Click on text layers to select and edit them</li>
            <li>Use the "Download Frame" button to save the current frame with text overlays</li>
            <li>Note: Full video rendering with text requires additional processing. This demo shows real-time overlay on video frames.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
