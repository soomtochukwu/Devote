import { PersonProposalStruct, PersonPublic } from "@/interfaces/Person";
import { ProposalPublic, ProposalVoteTypeStruct } from "@/interfaces/Proposal";
import { Abi, useContract } from "@starknet-react/core";
import { shortString } from "starknet";
const contractAddress =
  "0x01424945ceb915f35dd1bb94c83222bdcc4405ef1aedbfc0d79b41091be1f9c0";

const abi: Abi = [
  {
    type: "impl",
    name: "TestImpl",
    interface_name: "DeVote::ITest",
  },
  {
    type: "struct",
    name: "DeVote::PersonProposalStruct",
    members: [
      {
        name: "proposal_id",
        type: "core::felt252",
      },
      {
        name: "role",
        type: "core::integer::u8",
      },
    ],
  },
  {
    type: "struct",
    name: "DeVote::PersonPublic",
    members: [
      {
        name: "wallet_id",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "id_number",
        type: "core::felt252",
      },
      {
        name: "role",
        type: "core::felt252",
      },
      {
        name: "proposals",
        type: "core::array::Array::<DeVote::PersonProposalStruct>",
      },
    ],
  },
  {
    type: "struct",
    name: "core::integer::u256",
    members: [
      {
        name: "low",
        type: "core::integer::u128",
      },
      {
        name: "high",
        type: "core::integer::u128",
      },
    ],
  },
  {
    type: "enum",
    name: "core::bool",
    variants: [
      {
        name: "False",
        type: "()",
      },
      {
        name: "True",
        type: "()",
      },
    ],
  },
  {
    type: "struct",
    name: "DeVote::ProposalVoteTypeStruct",
    members: [
      {
        name: "vote_type",
        type: "core::felt252",
      },
      {
        name: "count",
        type: "core::integer::u256",
      },
      {
        name: "is_active",
        type: "core::bool",
      },
    ],
  },
  {
    type: "struct",
    name: "DeVote::ProposalVoterStruct",
    members: [
      {
        name: "has_voted",
        type: "core::bool",
      },
      {
        name: "role",
        type: "core::integer::u8",
      },
    ],
  },
  {
    type: "struct",
    name: "DeVote::ProposalPublic",
    members: [
      {
        name: "id",
        type: "core::felt252",
      },
      {
        name: "name",
        type: "core::felt252",
      },
      {
        name: "state",
        type: "core::integer::u8",
      },
      {
        name: "total_voters",
        type: "core::integer::u256",
      },
      {
        name: "has_voted",
        type: "core::integer::u256",
      },
      {
        name: "type_votes",
        type: "core::array::Array::<DeVote::ProposalVoteTypeStruct>",
      },
      {
        name: "voter",
        type: "DeVote::ProposalVoterStruct",
      },
    ],
  },
  {
    type: "struct",
    name: "DeVote::PersonIdStruct",
    members: [
      {
        name: "wallet_id",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "id_number",
        type: "core::felt252",
      },
    ],
  },
  {
    type: "interface",
    name: "DeVote::ITest",
    items: [
      {
        type: "function",
        name: "create_new_person",
        inputs: [
          {
            name: "person_id",
            type: "core::felt252",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "change_person_rol",
        inputs: [
          {
            name: "new_rol",
            type: "core::felt252",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "get_person",
        inputs: [],
        outputs: [
          {
            type: "DeVote::PersonPublic",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_person_rol",
        inputs: [],
        outputs: [
          {
            type: "core::felt252",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_person_proposals",
        inputs: [],
        outputs: [
          {
            type: "core::array::Array::<DeVote::PersonProposalStruct>",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "create_proposal",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
          {
            name: "name",
            type: "core::felt252",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "get_proposal",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
        ],
        outputs: [
          {
            type: "DeVote::ProposalPublic",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "add_voter",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
          {
            name: "voter_id",
            type: "core::felt252",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "modify_voters",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
          {
            name: "voter_id",
            type: "core::felt252",
          },
          {
            name: "role",
            type: "core::integer::u8",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "remove_voters",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
          {
            name: "voter_id",
            type: "core::felt252",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "add_vote_type",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
          {
            name: "vote_type",
            type: "core::felt252",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "remove_vote_type",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
          {
            name: "vote_type",
            type: "core::felt252",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "get_vote_types",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
        ],
        outputs: [
          {
            type: "core::array::Array::<DeVote::ProposalVoteTypeStruct>",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "start_votation",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "vote",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
          {
            name: "vote_type",
            type: "core::felt252",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "end_votation",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "view_votation",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
        ],
        outputs: [
          {
            type: "core::array::Array::<DeVote::ProposalVoteTypeStruct>",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "view_person_list",
        inputs: [],
        outputs: [
          {
            type: "core::array::Array::<DeVote::PersonIdStruct>",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_all_person_ids",
        inputs: [],
        outputs: [
          {
            type: "core::array::Array::<DeVote::PersonIdStruct>",
          },
        ],
        state_mutability: "view",
      },
    ],
  },
  {
    type: "constructor",
    name: "constructor",
    inputs: [],
  },
];

export function useContractCustom() {
  const { contract } = useContract({
    abi: abi,
    address: contractAddress,
  });

  const getPersonProposals = async (): Promise<PersonProposalStruct[]> => {
    const result: PersonProposalStruct[] =
      await contract?.get_person_proposals();
    console.log(result);
    return result;
  };

  const getMyProposals = async (
    status: number = 0
  ): Promise<ProposalPublic[]> => {
    const proposalIds: PersonProposalStruct[] = await getPersonProposals();
    const proposals: ProposalPublic[] = [];
    for (const proposalId of proposalIds) {
      const proposal = await getProposal(proposalId.proposal_id);
      proposals.push(proposal);
    }
    return proposals.filter((p) => p.state === status);
  };

  const getPerson = async (): Promise<PersonPublic> => {
    const result: PersonPublic = await contract?.get_person();
    console.log(result);
    return result;
  };

  const getProposal = async (proposal_id: string): Promise<ProposalPublic> => {
    const result: ProposalPublic = await contract?.get_proposal(proposal_id);
    result.name = shortString.decodeShortString(result.name);
    result.state = Number(result.state);
    result.total_voters = Number(result.total_voters);
    result.has_voted = Number(result.has_voted);
    result.type_votes = result.type_votes
      .map((type) => {
        type.vote_type = shortString.decodeShortString(type.vote_type);
        type.count = Number(type.count);
        return type;
      })
      .filter((type) => type.is_active);
    console.log(result);
    return result;
  };

  const vote = async (proposal_id: string, vote_type: string) => {
    const result = await contract?.vote(proposal_id, vote_type);
    console.log(result);
    return result;
  };

  const viewVotation = async (
    proposal_id: string
  ): Promise<ProposalVoteTypeStruct[]> => {
    const result: ProposalVoteTypeStruct[] = await contract?.view_votation(
      proposal_id
    );
    console.log(result);
    return result;
  };

  return {
    contract,
    getPersonProposals,
    getPerson,
    getProposal,
    vote,
    viewVotation,
    getMyProposals,
  };
}
