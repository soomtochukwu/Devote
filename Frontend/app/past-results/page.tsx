import Header from '../components/Header'
import Footer from '../components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const pastVotings = [
  { 
    id: 1, 
    name: "City Council Election", 
    totalVotes: 10000, 
    candidates: [
      { name: "Jane Doe", votes: 4500, percentage: 45 },
      { name: "John Smith", votes: 3500, percentage: 35 },
      { name: "Alice Johnson", votes: 2000, percentage: 20 },
    ]
  },
  { 
    id: 2, 
    name: "School Board Election", 
    totalVotes: 5000, 
    candidates: [
      { name: "Bob Wilson", votes: 2500, percentage: 50 },
      { name: "Carol Brown", votes: 1500, percentage: 30 },
      { name: "David Lee", votes: 1000, percentage: 20 },
    ]
  },
]

const participationStats = {
  totalVoters: 50000,
  activeVoters: 35000,
  averageTurnout: "70%",
}

export default function PastResultsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#f7cf1d]">Past Voting Results</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {pastVotings.map((voting) => (
            <Card key={voting.id} className="bg-gray-900 border-[#f7cf1d]">
              <CardHeader>
                <CardTitle className="text-[#f7cf1d]">{voting.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-white">Total Votes: {voting.totalVotes}</p>
                {voting.candidates.map((candidate, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between mb-1 text-white">
                      <span>{candidate.name}</span>
                      <span>{candidate.percentage}%</span>
                    </div>
                    <Progress value={candidate.percentage} className="h-2 bg-gray-700">
                      <div className="h-full bg-orange-500" style={{ width: `${candidate.percentage}%` }} />
                    </Progress>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="mt-8 bg-gray-900 border-[#f7cf1d]">
          <CardHeader>
            <CardTitle className="text-[#f7cf1d]">Historical Participation Statistics</CardTitle>
          </CardHeader>
          <CardContent className="text-white">
            <p>Total Registered Voters: {participationStats.totalVoters}</p>
            <p>Active Voters: {participationStats.activeVoters}</p>
            <p>Average Turnout: {participationStats.averageTurnout}</p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

