"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { useContractCustom } from "@/hooks/use-contract";
import { ProposalPublic } from "@/interfaces/Proposal";

const participationStats = {
  totalVoters: 50000,
  activeVoters: 35000,
  averageTurnout: "70%",
};

export default function PastResultsPage() {
  const { getMyProposals } = useContractCustom();
  const [pastVotings, setPastVoting] = useState<ProposalPublic[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const proposals = await getMyProposals(2);
      setPastVoting(proposals);
    };
    fetchData();
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#f7cf1d]">
          Past Voting Results
        </h1>
        <div className="grid gap-6 md:grid-cols-2">
          {pastVotings.map((voting) => (
            <Card key={voting.id} className="bg-gray-900 border-[#f7cf1d]">
              <CardHeader>
                <CardTitle className="text-[#f7cf1d]">{voting.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-white">
                  Total Votes: {voting.total_voters}
                </p>
                {voting.type_votes.map((option) => (
                  <div key={option.vote_type} className="mb-4">
                    <div className="flex justify-between mb-1 text-white">
                      <span>{option.vote_type}</span>
                      <span>{(option.count / voting.total_voters) * 50}%</span>
                    </div>
                    <Progress
                      value={(option.count / voting.total_voters) * 50}
                      className="h-2 bg-gray-700"
                    >
                      <div
                        className="h-full bg-orange-500"
                        style={{
                          width: `${
                            (option.count / voting.total_voters) * 50
                          }%`,
                        }}
                      />
                    </Progress>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
        {/*<Card className="mt-8 bg-gray-900 border-[#f7cf1d]">
          <CardHeader>
            <CardTitle className="text-[#f7cf1d]">
              Historical Participation Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="text-white">
            <p>Total Registered Voters: {participationStats.totalVoters}</p>
            <p>Active Voters: {participationStats.activeVoters}</p>
            <p>Average Turnout: {participationStats.averageTurnout}</p>
          </CardContent>
        </Card>*/}
      </main>
      <Footer />
    </div>
  );
}
