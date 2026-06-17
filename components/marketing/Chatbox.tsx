"use client"

import { useRouter } from "next/navigation";
import { useDashboardContext } from "@/components/dashboard/DashboardContext";
import { useRef, useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

import { SendIcon } from "lucide-react";
import { CameraIcon } from "lucide-react";
import { ExpandIcon } from "lucide-react";
import { XIcon } from "@/components/ui/icons";
import { ArrowUpLeftIcon } from "lucide-react";

const SparkleIcon = () => (
  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
    {/* Large Sparkle */}
    <path d="M10 2L12.5 7.5L18 10L12.5 12.5L10 18L7.5 12.5L2 10L7.5 7.5Z" />
    {/* Small Sparkle */}
    <path d="M19 12L20.2 14.7L23 15.9L20.2 17.1L19 19.8L17.8 17.1L15 15.9L17.8 14.7Z" />
  </svg>
);

export default function Chatbox () {
  const router = useRouter();
  const { darkMode } = useDashboardContext();

  type Message = {
    id: number;
    role: "user" | "ai";
    type: "text" | "image";
    content: string;
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "ai",
      type: "text",
      content: "Tell me what's on your mind or snap a herb!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const sendMessageAction = useAction(
    api.ai_model.sendMessage
  );

  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleBack = () => {
    router.push('/dashboard');
  };

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const messageText = input.trim();
    if (!messageText || isSending) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      type: "text",
      content: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const aiResponse = await sendMessageAction({ message: messageText });
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          type: "text",
          content: aiResponse ?? "Sorry, I didn't get a response.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          type: "text",
          content: "Something went wrong while sending your message. Please try again.",
        },
      ]);
      console.error("AI send error:", error);
    } finally {
      setIsSending(false);
    }
  };

  // 📸 Start camera
  const startCamera = async () => {
    setCameraOpen(true);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" }
      },
    });

    streamRef.current = stream;

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  // Stop camera
  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setCameraOpen(false);
  };

  //  Capture image
  const captureImage = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    const imageUrl = canvas.toDataURL("image/png");

    const newMessage: Message = {
      id: Date.now(),
      role: "user",
      type: "image",
      content: imageUrl,
    };

    setMessages((prev) => [...prev, newMessage]);

    stopCamera();
  }

  return (
    <main className={`px-4 py-4 sm:px-6 sm:py-6 ${darkMode ? 'bg-[#0f0f0f] text-[#e0e0e0]' : 'bg-[#f5f7f6]'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5">
        <button onClick={handleBack} 
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${darkMode ? 'bg-[#222224] text-white border border-neutral-700 hover:border-neutral-700/50' : 'bg-emerald-50 text-[#222224] border border-emerald-100 hover:border-emerald-100'}`}>
          <ArrowUpLeftIcon className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
      </div>
      
      <section className={`mx-auto flex h-auto sm:h-[calc(100vh-2rem)] max-h-[calc(100vh-4rem)] min-h-112 w-full max-w-6xl flex-col overflow-hidden rounded-3xl shadow-lg relative ${darkMode ? 'border-neutral-700 bg-[#1c1c1c]' : 'border-slate-200 bg-white'}`}>
        {/* Header */}
        <header className={`flex h-20 items-center justify-between gap-3 border-b px-4 sm:px-6 ${darkMode ? 'border-neutral-800' : 'border-slate-100'}`}>
          <div className="flex items-center gap-4">
            <div className={`grid h-8 w-8 place-items-center rounded-full ${darkMode ? 'bg-green-900 text-green-300' : 'bg-green-50 text-green-500'}`}>
              <SparkleIcon />
            </div>

            <div>
              <h1 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-950'}`}>Herbal Mind AI</h1>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <span className={`text-[10px] font-bold uppercase ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                  Online
                </span>
              </div>
            </div>

          </div>

          <div className={`flex items-center gap-6 ${darkMode ? 'text-green-300' : 'text-green-500'}`}>
            <button type="button" className="text-xl hover:opacity-70" aria-label="Maximize chat">
              <ExpandIcon />
            </button>
            <button type="button" className="text-xl hover:opacity-70" aria-label="Close chat">
              <XIcon />
            </button>
          </div>
        </header>

        {/* Chat Messages Area */}
        <div className={`flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 ${darkMode ? 'bg-[#171717]' : 'bg-white'}`}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md ${msg.type === 'image' ? 'px-0 py-0 overflow-hidden' : 'px-4 py-2'} rounded-2xl ${
                  msg.role === "user"
                    ? darkMode
                      ? "bg-green-700 text-white"
                      : "bg-green-600 text-white"
                    : darkMode
                    ? "bg-[#222224] text-gray-200"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {msg.type === "text" && <p className="text-sm">{msg.content}</p>}
                {msg.type === "image" && (
                  <img src={msg.content} alt="captured" className="w-full h-auto max-h-[40vh] object-contain block" />
                )}
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex justify-start">
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${darkMode ? 'bg-[#222224] text-gray-200' : 'bg-gray-200 text-gray-900'}`}>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium">Herbal Mind AI is typing</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <footer className={`border-t px-4 py-4 sm:px-5 sm:py-5 ${darkMode ? 'border-neutral-800 bg-[#161616]' : 'border-slate-100 bg-white'}`}>
          <form
            className="flex flex-col gap-4 sm:flex-row sm:items-center"
            onSubmit={handleSend}
          >
            <div className={`flex h-11 flex-1 min-w-0 items-center rounded-xl px-4 sm:px-5 ${darkMode ? 'bg-[#222224]' : 'bg-[#eef4ff]'}`}>
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className={`h-full w-full min-w-0 flex-1 bg-transparent text-sm outline-none ${darkMode ? 'text-neutral-100 placeholder:text-green-300/80' : 'text-slate-800 placeholder:text-green-600/80'}`}
                placeholder="Enter message..."
                type="text"
                disabled={isSending}
              />

              <button
                type="button"
                onClick={startCamera}
                className="shrink-0 grid h-8 w-8 place-items-center rounded-full text-green-600 hover:opacity-80"
                aria-label="Attach image"
                disabled={isSending}
              >
                <CameraIcon />
              </button>

              <button
                type="submit"
                className="shrink-0 grid h-8 w-8 place-items-center rounded-full bg-green-800 text-white hover:bg-green-700 disabled:opacity-50"
                aria-label="Send message"
                disabled={!input.trim() || isSending}
              >
                <SendIcon />
              </button>
            </div>
          </form>
        </footer>

        {/* CAMERA MODAL */}
        {cameraOpen && (
          <div className={`absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl ${darkMode ? 'bg-black/90' : 'bg-black/90'}`}>
            <div className="w-full px-4 sm:px-6">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline
                className="mx-auto max-h-[60vh] w-auto max-w-full object-contain rounded-lg"
              />
            </div>

            <div className="absolute bottom-8 flex gap-4 sm:gap-6">
              <button 
                onClick={captureImage}
                className="px-6 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition"
              >
                📸 Capture
              </button>
              <button 
                onClick={stopCamera}
                className="px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition"
              >
                ❌ Close
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}