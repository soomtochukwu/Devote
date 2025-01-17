'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useChat } from 'ai/react'
import { Send } from 'lucide-react'

export default function AIAgent() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  return (
    <Card className="bg-gray-900 border-[#f7cf1d] h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-[#f7cf1d]">AI Voting Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto mb-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-gray-400 text-center">
            Ask me anything about the candidates or the voting process!
          </div>
        )}
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-2 rounded-lg max-w-[80%] ${m.role === 'user' ? 'bg-[#f7cf1d] text-black' : 'bg-gray-700 text-white'}`}>
              <p>{m.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            className="flex-grow bg-gray-800 border-gray-700 text-white"
          />
          <Button type="submit" size="icon" className="bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

