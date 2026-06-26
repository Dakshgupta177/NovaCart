import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiSend } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../utils/api";
import Card from "./Card";

export default function AIShoppingAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "👋 Hi! Tell me what you're looking for. Example: '👟 I want red stylish sneakers under ₹5000', '📱 Suggest a high-performance smartphone with a good camera'.",
      products: [],
    },
  ]);

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!prompt.trim() || loading) return;

    const userPrompt = prompt.trim();

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: userPrompt,
    };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setLoading(true);

    try {
      const response = await api.post(
        "/api/ai/searchproductbyai",
        {
          query: userPrompt,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      const data = response.data;
      console.log(data)

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: data.message,
          products: data.products || [],
        },
      ]);

      if (data.rateLimit) {
        const remaining = data.rateLimit.remaining;

        toast.success(`${remaining} AI searches remaining`);

        if (remaining === 0) {
          toast("You have reached the limit. Please wait for reset.");
        }
      }
    } catch (error) {
      if (error?.response?.status === 429) {
        toast.error("AI search limit reached. Please try again later.");
      } else {
        toast.error(
          error?.response?.data?.message || "Unable to get recommendations.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4 backdrop-blur">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-bold text-2xl">AI Shopping Assistant</h1>

          <p className="text-zinc-400 text-sm mt-1">
            Describe what you need and get product recommendations instantly.
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {messages.map((message) => (
            <div key={message.id} className="mb-8">
              {/* User */}
              {message.role === "user" && (
                <div className="flex justify-end">
                  <div className="bg-blue-600 max-w-[80%] px-5 py-3 rounded-3xl rounded-br-md shadow-lg">
                    <p>{message.content}</p>
                  </div>
                </div>
              )}

              {/* Assistant */}
              {message.role === "assistant" && (
                <div>
                  <div className="flex justify-start">
                    <div className="bg-zinc-900 text-white border border-zinc-800 max-w-[90%] px-5 py-3 rounded-3xl rounded-bl-md">
                      <p>{message.content}</p>
                    </div>
                  </div>

                  {/* Products */}
                  {message.products?.length > 0 && (
                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {message.products.map((product) => (
                        <Card key={product._id} item={product} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Loading */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-zinc-900 text-white border border-zinc-800 rounded-3xl px-5 py-4">
                <div className="flex gap-2">
                  <div className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce" />
                  <div className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce delay-100" />
                  <div className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800">
        <div className="max-w-5xl mx-auto p-4">
          <div className="flex gap-3 items-end">
            <textarea
              rows={1}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the product you want..."
              className="flex-1 resize-none border border-zinc-800 rounded-2xl px-4 py-3 outline-none focus:border-zinc-600"
            />

            <button
              disabled={loading || !prompt.trim()}
              onClick={sendMessage}
              className="h-12 w-12 rounded-xl bg-white text-black flex items-center justify-center disabled:opacity-50"
            >
              <FiSend size={18} />
            </button>
          </div>

          <p className="text-center text-xs dark:text-zinc-500 text-zinc-700 mt-3">
            AI recommendations are based on products currently available in our
            catalog. Results may be limited or less accurate if suitable
            products are not found.
          </p>
        </div>
      </div>
    </div>
  );
}
