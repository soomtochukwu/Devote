use core::dict::Felt252Dict;
use core::nullable::{NullableTrait, match_nullable, FromNullableResult};

#[derive(Drop, PartialEq, Clone, Serde)]
enum PersonProposalRolState {
    view, 
    vote, 
    edit
}

#[derive(Drop, PartialEq, Clone, Serde)]
struct PersonProposalStruct {
    proposal_id: felt252,
    rol: PersonProposalRolState
}

struct Person {
    wallet_id: felt252,
    id_number: felt252,
    rol: felt252,
    proposals: Felt252Dict<PersonProposalStruct>
}

pub trait PersonTrait {
    fn create_person(wallet_id: felt252, id_number: felt252) -> Person;
    fn add_proposal(ref self: Person, proposal_id: felt252, rol: PersonProposalRolState);
    fn remove_proposal(ref self: Person, proposal_id: felt252);
}

impl PersonImpl of PersonTrait {
    fn create_person(wallet_id: felt252, id_number: felt252) -> Person {
        Person {
            wallet_id: wallet_id,
            id_number: id_number,
            rol: 0,
            proposals: Default::default()
        }
    }

    fn add_proposal(ref self: Person, proposal_id: felt252, rol: PersonProposalRolState) {
        let new_proposal = PersonProposalStruct {
            proposal_id: proposal_id,
            rol: rol
        };
        self.proposals.insert(proposal_id, new_proposal);
    }

    fn remove_proposal(ref self: Person, proposal_id: felt252) {
    }
}

#[derive(Drop)]
struct NewVoter {
    wallet_id: felt252,
    rol: felt252
}
