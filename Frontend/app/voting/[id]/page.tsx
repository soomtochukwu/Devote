'use client'

import { useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const votingOptions = [
  { id: 1, name: "Option A", description: "First proposed solution" },
  { id: 2, name: "Option B", description: "Second proposed solution" },
  { id: 3, name: "Option C", description: "Third proposed solution" },
]

export default function VotingStationPage() {
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [hasVoted, setHasVoted] = useState(false)

  const handleVote = () => {
    if (selectedOption) {
      setHasVoted(true)
      // Here you would typically send the vote to your backend
      console.log(`Voted for option: ${selectedOption}`)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#f7cf1d]">City Park Renovation</h1>
        
        <Card className="bg-gray-900 border-[#f7cf1d] max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-[#f7cf1d]">Cast Your Vote</CardTitle>
            <CardDescription className="text-gray-400">
              Choose your preferred option for the park renovation project
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasVoted ? (
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-[#f7cf1d] mb-4">Thank you for voting!</h2>
                <p className="text-gray-300">Your vote has been recorded successfully.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                  {votingOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={option.id.toString()} 
                        id={option.id.toString()}
                        className="border-[#f7cf1d] text-[#f7cf1d]"
                      />
                      <Label 
                        htmlFor={option.id.toString()}
                        className="text-gray-200 cursor-pointer"
                      >
                        {option.name} - {option.description}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                <Button 
                  onClick={handleVote}
                  disabled={!selectedOption}
                  className="w-full bg-[#f7cf1d] text-black hover:bg-[#e5bd0e] disabled:opacity-50"
                >
                  Submit Vote
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

