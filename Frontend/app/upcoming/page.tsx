"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContractCustom } from "@/hooks/use-contract";
import { useEffect, useState } from "react";
import { ProposalPublic } from "@/interfaces/Proposal";

const upcomingVotings = [
  {
    id: 1,
    name: "City Council Election",
    description: "Elect new members for the city council.",
  },
  {
    id: 2,
    name: "School Board Election",
    description: "Choose representatives for the local school board.",
  },
];

export default function UpcomingVotingsPage() {
  const { getMyProposals } = useContractCustom();
  const [upcomingVotings, setUpcomingVotings] = useState<ProposalPublic[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const proposals = await getMyProposals(0);
      setUpcomingVotings(proposals);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#f7cf1d]">
          Upcoming Votings
        </h1>
        <div className="grid gap-6 md:grid-cols-2">
          {upcomingVotings.map((voting) => (
            <Card key={voting.id} className="bg-gray-900 border-[#f7cf1d]">
              <CardHeader>
                <CardTitle className="text-[#f7cf1d]">{voting.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {/*<p className="text-gray-300">{voting.description}</p>*/}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
