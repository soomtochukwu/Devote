import Header from '../components/Header'
import Footer from '../components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

// Mock data for demonstration of active votings
const activeVotingResults = [
  { 
    id: 1, 
    name: "City Park Renovation",
    options: [
      { name: "Option A", votes: 150, percentage: 45 },
      { name: "Option B", votes: 100, percentage: 30 },
      { name: "Option C", votes: 85, percentage: 25 },
    ]
  },
  { 
    id: 2, 
    name: "Public Transportation Expansion",
    options: [
      { name: "Option A", votes: 200, percentage: 55 },
      { name: "Option B", votes: 165, percentage: 45 },
    ]
  },
]

export default function ResultsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 relative">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#f7cf1d]">Current Voting Results</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {activeVotingResults.map((voting) => (
            <Card key={voting.id} className="bg-gray-900 border-[#f7cf1d]">
              <CardHeader>
                <CardTitle className="text-[#f7cf1d]">{voting.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {voting.options.map((option, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between mb-1 text-white">
                      <span>{option.name}</span>
                      <span>{option.votes} votes</span>
                    </div>
                    <Progress value={option.percentage} className="h-2 bg-gray-700">
                      <div className="h-full bg-orange-500" style={{ width: `${option.percentage}%` }} />
                    </Progress>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="absolute bottom-4 right-8">
          <Button asChild className="bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]">
            <Link href="/past-results">View Past Results</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}

