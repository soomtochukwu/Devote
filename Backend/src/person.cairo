use core::dict::Felt252Dict;
use core::nullable::{NullableTrait, match_nullable, FromNullableResult};

#[derive(Drop, PartialEq, Serde, Copy)]
enum PersonProposalRolState {
    none,
    view, 
    vote, 
    edit
}

#[derive(Drop, Copy)]
struct PersonProposalStruct {
    proposal_id: felt252,
    rol: PersonProposalRolState,
}

struct Person {
    wallet_id: felt252,
    id_number: felt252,
    rol: felt252,
    proposals: Array<PersonProposalStruct>
}

pub trait PersonTrait {
    fn create_person(wallet_id: felt252, id_number: felt252) -> Person;
    fn add_proposal(ref self: Person, proposal_id: felt252, rol: PersonProposalRolState);
    fn get_all_proposals(ref self: Person) -> Array<PersonProposalStruct>;
    fn remove_proposal(ref self: Person, proposal_id: felt252);
}

impl PersonImpl<+Drop<Person>, +Copy<Person>> of PersonTrait {
    fn create_person(wallet_id: felt252, id_number: felt252) -> Person {
        Person {
            wallet_id: wallet_id,
            id_number: id_number,
            rol: 0,
            proposals: ArrayTrait::<PersonProposalStruct>::new()
        }
    }

    fn add_proposal(ref self: Person, proposal_id: felt252, rol: PersonProposalRolState) {
        let new_proposal = PersonProposalStruct {
            proposal_id: proposal_id,
            rol: rol,
        };
        self.proposals.append(new_proposal);
    }

    fn get_all_proposals(ref self: Person) -> Array<PersonProposalStruct> {
        let mut proposals = ArrayTrait::<PersonProposalStruct>::new();
        let mut idx = 0;
        while idx < self.proposals.len() {
            proposals.append(*self.proposals[idx]);
            idx += 1;
        };
        return proposals;
    }

    fn remove_proposal(ref self: Person, proposal_id: felt252) {
        let mut proposals = ArrayTrait::<PersonProposalStruct>::new();
        let mut idx = 0;
        while idx < self.proposals.len() {
            let temporal_proposal = *self.proposals[idx];
            if temporal_proposal.proposal_id != proposal_id {
                proposals.append(temporal_proposal);
            };
            idx += 1;
        };
        self.proposals = proposals;
    }

}
