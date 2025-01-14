use core::starknet::{ ContractAddress };
use starknet::storage::{ Vec,  Map };

#[derive(Drop, Copy, starknet::Store)]
pub struct PersonProposalStruct {
    pub proposal_id: felt252,
    pub rol: u8, //0 no tiene permisos, 1 solo puede ver, 2 puede votar, 3 puede editar
}

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct BasicPerson{
    pub wallet_id: ContractAddress,
    pub id_number: felt252,
    pub rol: felt252,
}

#[derive(Drop)]
#[starknet::storage_node]
pub struct Person {
    pub wallet_id: ContractAddress,
    pub id_number: felt252,
    pub rol: felt252,
    pub proposals: Vec<PersonProposalStruct>
}

#[derive(Drop, PartialEq, Clone, Serde, Destruct, Copy, starknet::Store)]
pub struct ProposalVoterStruct {
    pub has_voted: bool,
    pub rol: u8 //0 no tiene permisos, 1 solo puede ver, 2 puede votar, 3 puede editar
}

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct ProposalVoteTypeStruct {
    pub vote_type: felt252,
    pub count: u256,
    pub is_active: bool
}

#[starknet::storage_node]
pub struct Proposal {
    pub id: felt252,
    pub name: felt252,
    pub state: u8, //0 draft, 1 in_votation, 2 finalized
    pub type_votes: Vec<ProposalVoteTypeStruct>,
    pub voters: Map<ContractAddress, ProposalVoterStruct>
}

#[starknet::interface]
trait IDeVote<ContractState> {    
    fn create_new_person(ref self: ContractState, id_number: felt252);
    fn change_person_rol(ref self: ContractState, wallet_id: ContractAddress, new_rol: felt252);
    fn create_proposal(ref self: ContractState, proposal_id: felt252, name: felt252);
    fn add_voter(ref self: ContractState, proposal_id: felt252, voter_id: ContractAddress);
    fn modify_voters(ref self: ContractState, proposal_id: felt252, wallet_id: ContractAddress, rol: u8);
    fn remove_voters(ref self: ContractState, proposal_id: felt252, wallet_id: ContractAddress);
    fn add_vote_type(ref self: ContractState, proposal_id: felt252, vote_type: felt252);
    fn remove_vote_type(ref self: ContractState, proposal_id: felt252, vote_type: felt252);
    fn get_vote_types(ref self: ContractState, proposal_id: felt252) -> Array<ProposalVoteTypeStruct>;
    fn start_votation(ref self: ContractState, proposal_id: felt252);
    fn vote(ref self: ContractState, proposal_id: felt252, vote_type: felt252);
    fn end_votation(ref self: ContractState, proposal_id: felt252);
    fn view_votation(ref self: ContractState, proposal_id: felt252) -> Array<ProposalVoteTypeStruct>;
}

#[starknet::contract]
mod DeVote {
    use super::IDeVote;
    use super::PersonProposalStruct;
    use super::Person;
    use super::BasicPerson;
    use super::ProposalVoterStruct;
    use super::ProposalVoteTypeStruct;
    use super::Proposal;
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, MutableVecTrait, Map, StoragePathEntry,
    };
    use core::starknet::{ContractAddress, get_caller_address};

    #[storage]
    struct Storage{
        persons: Map<ContractAddress, Person>,
        proposals: Map<felt252, Proposal>,
    }

    #[abi(embed_v0)]
    impl DeVoteImpl of IDeVote<ContractState> {
        fn create_new_person(ref self: ContractState, id_number: felt252) {
            let wallet_id = get_caller_address();
            let mut person = self.persons.entry(wallet_id);
            person.id_number.write(id_number);
            person.wallet_id.write(wallet_id);
            person.rol.write(0);
        }

        fn change_person_rol(ref self: ContractState, wallet_id: ContractAddress, new_rol: felt252) {
            let mut person = self.persons.entry(wallet_id);
            person.rol.write(new_rol);
        }

        fn create_proposal(ref self: ContractState, proposal_id: felt252, name: felt252) {
            let mut proposal = self.proposals.entry(proposal_id);
            proposal.id.write(proposal_id);
            proposal.name.write(name);
            proposal.state.write(0);

            let mut proposal_creator = self.persons.entry(get_caller_address());
            let temp = PersonProposalStruct {
                proposal_id: proposal_id,
                rol: 3,
            };
            proposal_creator.proposals.append().write(temp);
        }

        fn add_voter(ref self: ContractState, proposal_id: felt252, voter_id: ContractAddress) {
            if can_modify_proposal(@self, proposal_id, 0) {
                let mut proposal = self.proposals.entry(proposal_id);
                let temp = ProposalVoterStruct {
                    has_voted: false,
                    rol: 1,
                };
                proposal.voters.entry(voter_id).write(temp);
            }
        }

        fn modify_voters(ref self: ContractState, proposal_id: felt252, wallet_id: ContractAddress, rol: u8) {
            if can_modify_proposal(@self, proposal_id, 0) {
                let mut proposal = self.proposals.entry(proposal_id);
                let mut voter = proposal.voters.entry(wallet_id);
                voter.rol.write(rol);
            }
        }

        fn remove_voters(ref self: ContractState, proposal_id: felt252, wallet_id: ContractAddress) {
            if can_modify_proposal(@self, proposal_id, 0) {
                let mut proposal = self.proposals.entry(proposal_id);
                let mut voter = proposal.voters.entry(wallet_id);
                voter.rol.write(0);
            }
        }

        fn add_vote_type(ref self: ContractState, proposal_id: felt252, vote_type: felt252) {
            if can_modify_proposal(@self, proposal_id, 0) {
                let mut proposal = self.proposals.entry(proposal_id);
                let temp = ProposalVoteTypeStruct {
                    vote_type: vote_type,
                    count: 0,
                    is_active: true,
                };
                proposal.type_votes.append().write(temp);
            }
        }

        fn remove_vote_type(ref self: ContractState, proposal_id: felt252, vote_type: felt252) {
            if can_modify_proposal(@self, proposal_id, 0) {
                let mut proposal = self.proposals.entry(proposal_id);
                if proposal.state.read() != 0 {
                    return;
                }
                let mut idx = 0;
                while idx < proposal.type_votes.len() {
                    let vote = proposal.type_votes.at(idx).read();
                    if vote.vote_type == vote_type {
                        proposal.type_votes.at(idx).is_active.write(false);
                        break;
                    }
                    idx += 1;
                }
            }
        }

        fn get_vote_types(ref self: ContractState, proposal_id: felt252) -> Array<ProposalVoteTypeStruct> {
            let mut proposals = ArrayTrait::<ProposalVoteTypeStruct>::new();
            let proposal = self.proposals.entry(proposal_id);
            let mut idx = 0;
            while idx < proposal.type_votes.len() {
                proposals.append(proposal.type_votes.at(idx).read());
                idx += 1;
            };
            return proposals;
        }

        fn start_votation(ref self: ContractState, proposal_id: felt252) {
            let mut proposal = self.proposals.entry(proposal_id);
            if can_modify_proposal(@self, proposal_id, 0) {
                proposal.state.write(1);
            }
        }

        fn vote(ref self: ContractState, proposal_id: felt252, vote_type: felt252) {
            let wallet_id = get_caller_address();
            let mut proposal = self.proposals.entry(proposal_id);
            if proposal.state.read() != 1 {
                return;
            }
            let voter = proposal.voters.entry(wallet_id);
            if voter.rol.read() == 0 {
                return;
            } else if voter.rol.read() == 1 {
                return;
            } else if voter.has_voted.read() {
                return;
            } else {
                let mut idx = 0;
                while idx < proposal.type_votes.len() {
                    let vote = proposal.type_votes.at(idx).read();
                    if vote.vote_type == vote_type {
                        proposal.type_votes.at(idx).count.write(vote.count + 1);
                        voter.has_voted.write(true);
                        break;
                    }
                    idx += 1;
                }
            }
        }

        fn end_votation(ref self: ContractState, proposal_id: felt252) {
            if can_modify_proposal(@self, proposal_id, 2){
                let mut proposal = self.proposals.entry(proposal_id);
                proposal.state.write(2);
            }
        }

        fn view_votation(ref self: ContractState, proposal_id: felt252) -> Array<ProposalVoteTypeStruct> {
            let mut votation = ArrayTrait::<ProposalVoteTypeStruct>::new();
            let proposal = self.proposals.entry(proposal_id);
            let mut idx = 0;
            while idx < proposal.type_votes.len() {
                let vote = proposal.type_votes.at(idx).read();
                if vote.is_active {
                    votation.append(vote);
                }
                idx += 1;
            };
            return votation;
        }
        
    }

    fn can_modify_proposal(self: @ContractState, proposal_id: felt252, proposal_status: u8) -> bool {
        let wallet_id = get_caller_address();
        let proposal = self.proposals.entry(proposal_id);
        if proposal.state.read() != proposal_status {
            return false;
        } else {
            let voter = proposal.voters.entry(wallet_id);
            if voter.rol.read() == 3 {
                return true;
            }
        }

        return false;
    }
}