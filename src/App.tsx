import React, { useState, useEffect, useRef } from 'react';
import { Video, Mic, MicOff, VideoOff, MessageCircle, X, Send } from 'lucide-react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import ChatBox from './components/ChatBox';
import VideoPlayer from './components/VideoPlayer';
import Button from './components/Button';

function App() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  
  const peerRef = useRef<Peer.Instance | null>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setStream(stream);
      })
      .catch(err => {
        console.error("Error accessing media devices:", err);
      });

    // Initialize socket connection
    socketRef.current = io('https://your-server.com');
    
    socketRef.current.on('userCount', (count: number) => {
      setOnlineUsers(count);
    });

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const findNewPartner = () => {
    setIsSearching(true);
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    setRemoteStream(null);
    // Implement peer connection logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Video Chat</h1>
          <p className="text-gray-300">{onlineUsers} users online</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
              <VideoPlayer stream={stream} muted />
              <div className="absolute bottom-4 left-4 flex gap-2">
                <Button onClick={toggleMute}>
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
                <Button onClick={toggleVideo}>
                  {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
              {remoteStream ? (
                <VideoPlayer stream={remoteStream} />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white text-lg">
                    {isSearching ? "Searching for partner..." : "Click 'Next' to start"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <Button 
            onClick={findNewPartner}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Next
          </Button>
          <Button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="bg-green-600 hover:bg-green-700"
          >
            <MessageCircle className="w-5 h-5" />
          </Button>
        </div>

        {isChatOpen && (
          <ChatBox onClose={() => setIsChatOpen(false)} />
        )}
      </div>
    </div>
  );
}

export default App;