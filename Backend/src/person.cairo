use core::dict::Felt252Dict;

#[derive(Drop, PartialEq)]
enum PersonProposalRolState {
    view, 
    vote, 
    edit
}

#[derive(Drop, PartialEq)]
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

#[generate_trait]
impl PersonImpl of PersonTrait {
    fn create_person(wallet_id: felt252, id_number: felt252) -> Person {
        Person {
            wallet_id: wallet_id,
            id_number: id_number,
            rol: 0,
            proposals: Default::default()
        }
    }

    fn add_proposal(self: @Person, proposal_id: felt252, rol: PersonProposalRolState) {
        let new_proposal = PersonProposalStruct {
            proposal_id: proposal_id,
            rol: rol
        };
        self.proposals.insert(proposal_id, new_proposal);
    }
}

#[derive(Drop)]
struct NewVoter {
    wallet_id: felt252,
    rol: felt252
}
