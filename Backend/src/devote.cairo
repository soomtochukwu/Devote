use core::dict::Felt252Dict;
use src::person::Person;
use src::proposal::Proposal;

#[starknet::interface]
trait IDeVote<ContractState> {    
    fn create_person(ref self: ContractState, id_number: felt252);
    fn change_person_rol(ref self: ContractState, wallet_id: felt252, new_rol: felt252);
    fn create_proposal(ref self: ContractState, name: felt252);
    fn add_voters(ref self: ContractState, proposal_id: felt252, voters: Array<NewVoter>);
    fn modify_voters(ref self: ContractState, proposal_id: felt252, wallet_id: felt252, rol: felt252);
    fn remove_voters(ref self: ContractState, proposal_id: felt252, wallet_id: felt252);
    fn add_vote_type(ref self: ContractState, proposal_id: felt252, vote_type: felt252);
    fn remove_vote_type(ref self: ContractState, proposal_id: felt252, vote_type: felt252);
    fn start_votation(ref self: ContractState, proposal_id: felt252);
    fn vote(ref self: ContractState, proposal_id: felt252, vote_type: felt252);
    fn end_votation(ref self: ContractState, proposal_id: felt252);
    fn view_votation(ref self: ContractState, proposal_id: felt252) -> Felt252Dict<ProposalVoteTypeStruct>;
}

#[starknet::contract]
mod DeVote {
    use super::IDeVote;

    #[storage]
    struct Storage{
        proposals: Felt252Dict<Proposal>,
        persons: Felt252Dict<Person>
    }

    #[constructor]
    fn constructor(ref self: ContractState){
        let mut proposals: Felt252Dict<Proposal> = Default::default()
        self.proposals.write(proposals);
        let mut persons: Felt252Dict<Person> = Default::default()
        self.persons.write(persons);
    }

    #[abi(embed_v0)]
    impl DeVoteImpl of IDeVote<ContractState> {
       
        fn create_person(ref self: ContractState, id_number: felt252){
            let wallet_id = starknet::self_address();
            let person = Person{
                wallet_id: wallet_id,
                id_number: id_number,
                rol: 'none',
                proposals: Default::default()
            };
            let persons = self.persons.read();
            persons.insert(wallet_id, person);
            self.persons.write(persons);
        }

        fn change_person_rol(ref self: ContractState, wallet_id: felt252, new_rol: felt252){
            let mut persons = self.persons.read();
            let person = persons.get(wallet_id);
            person.rol = new_rol;
            persons.insert(wallet_id, person);
            self.persons.write(persons);
        }

        fn create_proposal(ref self: ContractState, proposal_id: felt252, name: felt252){
            let proposal = Proposal{
                id: proposal_id,
                name: name,
                state: 'draft',
                type_votes: Default::default(),
                voters: Default::default()
            };
            let proposals = self.proposals.read();
            proposals.insert(proposal_id, proposal);
            self.proposals.write(proposals);
        }

        fn add_voters(ref self: ContractState, proposal_id: felt252, voters: Array<NewVoter>){
            let mut proposals = self.proposals.read();
            let proposal = proposals.get(proposal_id);

            if proposal.state == 'draft' {
                let idx = 0;
                while idx < voters.len(){
                    let voter = *voters(idx);
                    let new_voter = ProposalVoterStruct{
                        wallet_id: voter.wallet_id,
                        has_voted: false,
                        rol: voter.rol
                    };
                    proposal.voters.insert(voter.wallet_id, new_voter);
                    idx += 1;
                }

                proposals.insert(proposal_id, proposal);
                self.proposals.write(proposals);
            }
        }

        fn modify_voters(ref self: ContractState, proposal_id: felt252, wallet_id: felt252, rol: felt252){
            let mut proposals = self.proposals.read();
            let proposal = proposals.get(proposal_id);

            if proposal.state == 'draft' {
                let voter = proposal.voters.get(wallet_id);
                voter.rol = rol;
                proposal.voters.insert(wallet_id, voter);
                proposals.insert(proposal_id, proposal);
                self.proposals.write(proposals);
            }
        }

        fn remove_voters(ref self: ContractState, proposal_id: felt252, wallet_id: felt252){
            let mut proposals = self.proposals.read();
            let proposal = proposals.get(proposal_id);

            if proposal.state == 'draft' {
                proposal.voters.insert(wallet_id, Default::default());
                proposals.insert(proposal_id, proposal);
                self.proposals.write(proposals);
            }
        }

        fn add_vote_type(ref self: ContractState, proposal_id: felt252, vote_type: felt252){
            let mut proposals = self.proposals.read();
            let proposal = proposals.get(proposal_id);
            
            if propsal.state == 'draft' {
                let new_vote_type = ProposalVoteTypeStruct{
                    vote_type: vote_type,
                    count: 0
                };
                proposal.type_votes.insert(vote_type, new_vote_type);
                proposals.insert(proposal_id, proposal);
                self.proposals.write(proposals);
            }
        }

        fn remove_vote_type(ref self: ContractState, proposal_id: felt252, vote_type: felt252){
            let mut proposals = self.proposals.read();
            let proposal = proposals.get(proposal_id);

            if propsal.state == 'draft' {
                proposal.type_votes.insert(vote_type, Default::default());
                proposals.insert(proposal_id, proposal);
                self.proposals.write(proposals);
            }
        }

        fn start_votation(ref self: ContractState, proposal_id: felt252){
            let mut proposals = self.proposals.read();
            let proposal = proposals.get(proposal_id);

            if propsal.state == 'draft' {
                proposal.state = 'in_votation';
                proposals.insert(proposal_id, proposal);
                self.proposals.write(proposals);
            }
        }

        fn vote(ref self: ContractState, proposal_id: felt252, vote_type: felt252){
            let wallet_id = starknet::self_address();
            let mut proposals = self.proposals.read();
            let proposal = proposals.get(proposal_id);
            if proposal.state == 'in_votation' {
                let voter = proposal.voters.get(wallet_id);
                if voter.has_voted == false {
                    voter.has_voted = true;
                    proposal.voters.insert(wallet_id, voter);
                    let vote_type = proposal.type_votes.get(vote_type);
                    vote_type.count += 1;
                    proposal.type_votes.insert(vote_type, vote_type);
                    proposals.insert(proposal_id, proposal);
                    self.proposals.write(proposals);
                }
            }
        }

        fn end_votation(ref self: ContractState, proposal_id: felt252){
            let mut proposals = self.proposals.read();
            let proposal = proposals.get(proposal_id);

            if propsal.state == 'in_votation' {
                proposal.state = 'finalized';
                proposals.insert(proposal_id, proposal);
                self.proposals.write(proposals);
            }
        }

        fn view_votation(ref self: ContractState, proposal_id: felt252) -> Felt252Dict<ProposalVoteTypeStruct> {
            let proposals = self.proposals.read();
            let proposal = proposals.get(proposal_id);
            return proposal.type_votes;
        }

    }
}